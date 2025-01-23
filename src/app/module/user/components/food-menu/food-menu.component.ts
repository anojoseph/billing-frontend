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
  showFilters: boolean = true;

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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
