import { Component, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FoodMenuService } from './foodmenu.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CartItem } from '../cart/cart.model';
import { Store } from '@ngrx/store';
import { addToCart } from '../cart/cart.actions';
import { MatDialog } from '@angular/material/dialog';
import { AddonDialogComponent } from './addon-dialog.component';
import { selectCartItems } from '../cart/cart.selectors';

@Component({
  selector: 'app-food-menu',
  templateUrl: './food-menu.component.html',
  styleUrls: ['./food-menu.component.css'],
})
export class FoodMenuComponent implements OnInit, OnChanges {
  foods: any[] = [];
  selectedType = '';
  selectedMealType = '';
  searchQuery = '';
  isMobile: boolean = false;
  filterchip: boolean = false;
  availbleqtystatus: boolean = false;
  mealTypes: any;
  foodTypes: any;
  searchControl = new FormControl('');
  showqty: boolean = false;
  cartItems$: CartItem[] = [];



  constructor(
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private foodmenuservice: FoodMenuService,
    private store: Store,
    private dialog: MatDialog,) {
    this.store.select(selectCartItems).subscribe(items => {
      this.cartItems$ = items;
    });
  }

  ngOnChanges() {
  }

  ngOnInit(): void {
    this.fetchMenuItems();
    this.checkDeviceWidth();
    this.getgeneralsetting();
    window.addEventListener('resize', this.checkDeviceWidth.bind(this));
    this.fetchmealtype();
    this.fetchfoodtype();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.fetchMenuItems();
      });

  }

  getgeneralsetting() {
    this.foodmenuservice.getSettings().subscribe((resp: any) => {
      this.showqty = resp?.show_available_qty
    })
  }

  fetchMenuItems(): void {
    const filters: any = { status: true };

    if (this.searchControl.value) {
      filters.search = this.searchControl.value.trim();
    }
    if (this.selectedMealType) {
      filters.mealType = this.selectedMealType;
    }
    if (this.selectedType) {
      filters.productItem = this.selectedType;
    }

    this.foodmenuservice.getfoodmenu(filters).subscribe(
      (response: any) => {
        if (response.data.length === 0) {
          this.foods = [];
          this.toastr.info("No matching products found");
        } else {
          this.foods = response.data;
        }
      },
      (error) => {
        this.toastr.error(error.message || "Error fetching food menu");
      }
    );
  }



  fetchmealtype() {
    this.foodmenuservice.getmealtype().subscribe((data: any) => {
      this.mealTypes = data;
    },
      (error) => {
        this.toastr.error(error.message || 'Error fetching meal type')
      })
  }

  fetchfoodtype() {
    this.foodmenuservice.getfoodtype().subscribe((data: any) => {
      this.foodTypes = data;
    },
      (error) => {
        this.toastr.error(error.message || 'Error fetching food type')
      })
  }

  selectFoodType(type: string) {
    this.selectedType = this.selectedType === type ? '' : type;
    this.fetchMenuItems();
  }

  selectMealType(meal: string) {
    this.selectedMealType = this.selectedMealType === meal ? '' : meal;
    this.fetchMenuItems();
  }


  availableqtycheck() {
    this.availbleqtystatus;
  }


  increaseQuantity(food: any): void {
    food.selectedQty++;
  }

  decreaseQuantity(food: any): void {
    if (food.selectedQty > 1) {
      food.selectedQty--;
    }
  }


  onAddToCart(item: any, selectedAddons: any[] = []) {
    if (!item.selectedQty || item.selectedQty <= 0) {
      this.toastr.error('Please select a quantity before adding to cart');
      return;
    }

    const cartItem: CartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.selectedQty,
      image: item.image || '',
      selectedQty: item.selectedQty,
      addons: selectedAddons,  // ✅ pass selected addons
      addonsAvailable: (item.addons && item.addons.length > 0) 

    };

    this.store.dispatch(addToCart({ item: cartItem }));
    this.toastr.success(`${item.name} added to cart with addons`);
  }




  checkDeviceWidth(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.filterchip = false;
    }
  }

  toggleView(): void {
    if (this.isMobile) {
      this.filterchip = !this.filterchip;
    }
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
  openAddonDialog(food: any) {
    // Try to find if item is already in cart
    const existingCartItem = this.cartItems$.find(i => i.id === food._id);

    // Merge base addons with qty from cart if exists
    const enrichedAddons = (food.addons || []).map((addon: any) => {
      const matched = existingCartItem?.addons?.find((a: any) => a.name === addon.name);
      return {
        ...addon,
        qty: matched?.qty ?? 1  // use existing qty or default to 1
      };
    });

    const dialogRef = this.dialog.open(AddonDialogComponent, {
      width: '500px',
      data: {
        addons: enrichedAddons
      }
    });

    dialogRef.afterClosed().subscribe((selectedAddons: any[]) => {
      if (selectedAddons && selectedAddons.length > 0) {
        this.onAddToCart(food, selectedAddons);
      }
    });
  }

}
