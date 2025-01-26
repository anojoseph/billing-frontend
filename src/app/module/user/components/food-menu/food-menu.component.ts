import { Component, effect, inject, Injector, Input, OnChanges, OnInit, runInInjectionContext } from '@angular/core'; // Import Injector
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';

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
  injector = inject(Injector);
  availableQty: Record<number, number> = {};
  @Input() orderQuantity: any;
  maxQuantity: number = 10;
  allowAddQty: any
  isMobile: boolean = false;
  filterchip: boolean = false;
  constructor(
    public cartService: CartService,
    private toastr: ToastrService) { }

  ngOnChanges() {
    if (this.orderQuantity < this.maxQuantity) {
      this.allowAddQty = true;
    } else {
      this.allowAddQty = false;
    }
  }

  ngOnInit(): void {
    this.fetchMenuItems();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.availableQty = this.cartService.availableQty$();
      });
    });

    this.checkDeviceWidth();
    window.addEventListener('resize', this.checkDeviceWidth.bind(this));
  }

  fetchMenuItems(): void {
    this.cartService.getMenuItems().subscribe((data: any[]) => {
      this.foods = data;
    });
  }

  addToCart(food: any) {
    const availableQty = this.availableQty[food.id] || 0;
    if (food.selectedQty > availableQty) {
      this.toastr.error(`Not enough stock available. Only ${availableQty} left.`);
      food.selectedQty = availableQty;
      return;
    }
    this.cartService.addToCart({ ...food, selectedQty: food.selectedQty });
    this.toastr.success(`${food.selectedQty} ${food.name} is added to Cart`)
    food.selectedQty = 1;
  }

  trackByFoodId(index: number, food: any): number {
    return food.id;
  }

  increaseQuantity(food: any): void {
    if (food.selectedQty < food.qty) {
      food.selectedQty++;
    } else {
      alert('No more stock available!');
      return;
    }
  }

  decreaseQuantity(food: any) {
    if (food.selectedQty > 1) {
      food.selectedQty--;
    }
  }


  get filteredFoods() {
    return this.foods.filter((food) => {
      const matchesType = this.selectedType ? food.type === this.selectedType : true;
      const matchesMealType = this.selectedMealType ? food.mealType === this.selectedMealType : true;
      const matchesSearch = this.searchQuery
        ? food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      return matchesType && matchesMealType && matchesSearch;
    });
  }

  foodTypes = ['Veg', 'Non-Veg', 'Drinks'];
  mealTypes = ['Lunch', 'Dinner', 'Snack'];

  selectFoodType(type: string) {
    if (type === 'All') {
      this.selectedType = '';
      this.selectedType = this.selectedType === type ? '' : type;
    }
  }

  selectMealType(meal: string) {
    if (meal === 'All') {
      this.selectedMealType = '';
    } else {
      this.selectedMealType = this.selectedMealType === meal ? '' : meal;
    }
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
}
