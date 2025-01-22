import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-food-menu',
  templateUrl: './food-menu.component.html',
  styleUrls: ['./food-menu.component.css'],
})
export class FoodMenuComponent implements OnInit {
  foods: any[] = []; // Dynamic array
  // foods = [
  //   {
  //     id: 1,
  //     name: 'Veg Pizza',
  //     price: 10,
  //     ingredients: ['Cheese', 'Tomato', 'Basil'],
  //     image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     type: 'Veg',
  //     mealType: 'Lunch',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     id: 2,
  //     name: 'Chicken Burger',
  //     price: 8,
  //     ingredients: ['Lettuce', 'Cheese', 'Chicken Patty'],
  //     image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     type: 'Non-Veg',
  //     mealType: 'Dinner',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     id: 3,
  //     name: 'Pasta',
  //     price: 12,
  //     ingredients: ['Cream', 'Mushrooms', 'Garlic'],
  //     image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     type: 'Veg',
  //     mealType: 'Lunch',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     id: 4,
  //     name: 'Snacks',
  //     price: 5,
  //     ingredients: ['Chips', 'Salsa'],
  //     image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     type: 'Veg',
  //     mealType: 'Snack',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     id: 5,
  //     name: 'Lemonade',
  //     price: 3,
  //     ingredients: ['Lemon', 'Sugar', 'Water'],
  //     image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     type: 'Veg',
  //     mealType: 'Cool Drink',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     'id': 6,
  //     'name': 'Fruit Salad',
  //     'price': 7,
  //     'ingredients': ['Apple', 'Banana', 'Orange'],
  //     'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     'type': 'Veg',
  //     'mealType': 'Snack',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     'id': 7,
  //     'name': 'Grilled Cheese Sandwich',
  //     'price': 6,
  //     'ingredients': ['Bread', 'Cheese', 'Butter'],
  //     'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     'type': 'Veg',
  //     'mealType': 'Breakfast',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     'id': 8,
  //     'name': 'Chicken Caesar Salad',
  //     'price': 11,
  //     'ingredients': ['Lettuce', 'Chicken', 'Croutons', 'Caesar Dressing'],
  //     'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     'type': 'Non-Veg',
  //     'mealType': 'Lunch',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     'id': 9,
  //     'name': 'Iced Tea',
  //     'price': 2,
  //     'ingredients': ['Tea', 'Sugar', 'Water'],
  //     'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     'type': 'Veg',
  //     'mealType': 'Cool Drink',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  //   {
  //     'id': 10,
  //     'name': 'Chocolate Brownie',
  //     'price': 4,
  //     'ingredients': ['Chocolate', 'Flour', 'Sugar', 'Eggs'],
  //     'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //     'type': 'Veg',
  //     'mealType': 'Dessert',
  //     qty: 10, // Total available quantity
  //     selectedQty: 1, // User's selected quantity (default to 1)
  //   },
  // ];

  selectedType = '';
  selectedMealType = '';
  searchQuery = '';

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.fetchMenuItems();

   }
  fetchMenuItems(): void {
    this.cartService.getMenuItems().subscribe((data: any[]) => {
      this.foods = data;
    });
  }
  /**
   * Updates the stock and resets the selected quantity.
   */
  updateStock(food: any, quantityChange: number) {
    const foodInMenu = this.foods.find((f) => f.id === food.id);
    if (foodInMenu) {
      foodInMenu.qty += quantityChange; // Adjust stock
    }
    food.selectedQty = 0; // Reset user selection
  }

  /**
   * Adds an item to the cart.
   */
  addToCart(food: any) {
    if (this.isValidSelection(food)) {
      this.cartService.addToCart({ ...food, selectedQty: food.selectedQty });
      this.updateStock(food, -food.selectedQty); // Deduct stock
    } else {
      alert('Invalid selection. Please check the quantity.');
    }
  }

  /**
   * Removes an item from the cart.
   */removeFromCart(food: any) {
    const cartItem = this.cartService.getCartItems().find(item => item.id === food.id);
    if (cartItem) {
      this.updateStock(food, cartItem.selectedQty); // Restock the full selected quantity
    }
    this.cartService.removeFromCart(food.id);
  }
  /**
   * Increases the selected quantity.
   */
  increaseQuantity(food: any): void {
    if (food.selectedQty < food.qty) {
      food.selectedQty++;
    } else {
      alert('No more stock available!');
    }
  }

  /**
   * Decreases the selected quantity.
   */
  decreaseQuantity(food: any) {
    if (food.selectedQty > 1) {
      food.selectedQty--;
    }
  }

  /**
   * Validates the user's selection.
   */
  isValidSelection(food: any): boolean {
    return food.selectedQty > 0 && food.selectedQty <= food.qty;
  }

  /**
   * Filters the menu based on selected criteria.
   */
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
