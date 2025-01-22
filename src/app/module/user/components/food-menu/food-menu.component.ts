import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-food-menu',
  templateUrl: './food-menu.component.html',
  styleUrls: ['./food-menu.component.css'],
})
export class FoodMenuComponent implements OnInit {
  foods: any[] = [];
  selectedType = '';
  selectedMealType = '';
  searchQuery = '';

  constructor(private cartService: CartService,
    private tosatr:ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchMenuItems();

   }
  fetchMenuItems(): void {
    this.cartService.getMenuItems().subscribe((data: any[]) => {
      this.foods = data;
    });
  }

  updateStock(food: any, quantityChange: number) {
    const foodInMenu = this.foods.find((f) => f.id === food.id);
    if (foodInMenu) {
      foodInMenu.qty += quantityChange; // Adjust stock
    }
    food.selectedQty = 0; // Reset user selection
  }


  addToCart(food: any) {
    if (this.isValidSelection(food)) {
      this.cartService.addToCart({ ...food, selectedQty: food.selectedQty });
      this.updateStock(food, -food.selectedQty); // Deduct stock
    } else {
      alert('Invalid selection. Please check the quantity.');
    }
  }

   removeFromCart(food: any) {
    const cartItem = this.cartService.getCartItems().find(item => item.id === food.id);
    if (cartItem) {
      this.updateStock(food, cartItem.selectedQty); // Restock the full selected quantity
    }
    this.cartService.removeFromCart(food.id);
  }

  increaseQuantity(food: any): void {
    if (food.selectedQty < food.qty) {
      food.selectedQty++;
    } else {
      alert('No more stock available!');
    }
  }

  decreaseQuantity(food: any) {
    if (food.selectedQty > 1) {
      food.selectedQty--;
    }
  }

  isValidSelection(food: any): boolean {
    return food.selectedQty > 0 && food.selectedQty <= food.qty;
  }

  applyFilters() {
    return this.foods.filter((food) => {
      const matchesType = this.selectedType ? food.type === this.selectedType : true;
      const matchesMealType = this.selectedMealType ? food.mealType === this.selectedMealType : true;
      const matchesSearch = this.searchQuery
        ? food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      return matchesType && matchesMealType && matchesSearch;
    });
  }

  updateCartQuantity(food: any, newQty: number) {
    if (newQty > 0 && newQty <= food.qty) {
      const cartItem = this.cartService.getCartItems().find(item => item.id === food.id);
      const difference = newQty - (cartItem?.selectedQty || 0);

      if (difference > 0) {
        this.updateStock(food, -difference); // Deduct stock
      } else if (difference < 0) {
        this.updateStock(food, -difference); // Restock
      }

      this.cartService.updateCart({ ...food, selectedQty: newQty });
    } else {
      alert('Invalid quantity.');
    }
  }

  get filteredFoods() {
    return this.foods.filter(food => {
      const matchesType = this.selectedType ? food.type === this.selectedType : true;
      const matchesMealType = this.selectedMealType ? food.mealType === this.selectedMealType : true;
      const matchesSearch = this.searchQuery
        ? food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      return matchesType && matchesMealType && matchesSearch;
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
  syncStock(food: any, change: number): void {
    const menuItem = this.foods.find((item) => item.id === food.id);
    if (menuItem) {
      menuItem.qty -= change;
    }
  }


  updateQuantity(order: any, change: number) {
    const newQuantity = order.selectedQty + change;
    const menuItem = this.cartService.getMenuItemById(order.id);

    if (menuItem && newQuantity > 0 && newQuantity <= menuItem.qty) {
      this.cartService.updateCart({ ...order, selectedQty: newQuantity });
      menuItem.qty -= change; // Adjust the stock
    } else {
      console.error('Invalid quantity or item not found.');
    }
  }

  showFilters: boolean = true;

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }


}
