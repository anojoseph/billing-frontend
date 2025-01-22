import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  selectedQty: number;
  availableQty: number; // Add available quantity for menu synchronization
}

export interface Food {
  id: number;
  name: string;
  price: number;
  qty: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Signal for cart items
  private cartSignal = signal<CartItem[]>([]);

  foods = [
    {
      id: 1,
      name: 'Veg Pizza',
      price: 10,
      ingredients: ['Cheese', 'Tomato', 'Basil'],
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      type: 'Veg',
      mealType: 'Lunch',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      id: 2,
      name: 'Chicken Burger',
      price: 8,
      ingredients: ['Lettuce', 'Cheese', 'Chicken Patty'],
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      type: 'Non-Veg',
      mealType: 'Dinner',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      id: 3,
      name: 'Pasta',
      price: 12,
      ingredients: ['Cream', 'Mushrooms', 'Garlic'],
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      type: 'Veg',
      mealType: 'Lunch',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      id: 4,
      name: 'Snacks',
      price: 5,
      ingredients: ['Chips', 'Salsa'],
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      type: 'Veg',
      mealType: 'Snack',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      id: 5,
      name: 'Lemonade',
      price: 3,
      ingredients: ['Lemon', 'Sugar', 'Water'],
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      type: 'Veg',
      mealType: 'Cool Drink',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      'id': 6,
      'name': 'Fruit Salad',
      'price': 7,
      'ingredients': ['Apple', 'Banana', 'Orange'],
      'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'type': 'Veg',
      'mealType': 'Snack',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      'id': 7,
      'name': 'Grilled Cheese Sandwich',
      'price': 6,
      'ingredients': ['Bread', 'Cheese', 'Butter'],
      'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'type': 'Veg',
      'mealType': 'Breakfast',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      'id': 8,
      'name': 'Chicken Caesar Salad',
      'price': 11,
      'ingredients': ['Lettuce', 'Chicken', 'Croutons', 'Caesar Dressing'],
      'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'type': 'Non-Veg',
      'mealType': 'Lunch',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      'id': 9,
      'name': 'Iced Tea',
      'price': 2,
      'ingredients': ['Tea', 'Sugar', 'Water'],
      'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'type': 'Veg',
      'mealType': 'Cool Drink',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
    {
      'id': 10,
      'name': 'Chocolate Brownie',
      'price': 4,
      'ingredients': ['Chocolate', 'Flour', 'Sugar', 'Eggs'],
      'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'type': 'Veg',
      'mealType': 'Dessert',
      qty: 10, // Total available quantity
      selectedQty: 1, // User's selected quantity (default to 1)
    },
  ];


  constructor() { }

  // Add item to cart
  addToCart(item: CartItem) {
    if (item.selectedQty <= 0 || item.price < 0) {
      throw new Error('Invalid item data');
    }

    const cart = this.cartSignal();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
      // Update the selected quantity and available quantity
      existingItem.selectedQty += item.selectedQty;
      existingItem.availableQty -= item.selectedQty;
    } else {
      // Add the item to the cart and reduce its available quantity
      item.availableQty -= item.selectedQty;
      cart.push({ ...item });
    }

    this.cartSignal.set(cart);
  }


  // Remove item from cart
  removeFromCart(itemId: string | number) {
    const cart = this.cartSignal();
    const itemToRemove = cart.find(i => i.id === itemId);

    if (itemToRemove) {
      // Restore the available quantity
      itemToRemove.availableQty += itemToRemove.selectedQty;
      const updatedCart = cart.filter(i => i.id !== itemId);
      this.cartSignal.set(updatedCart);
    }
  }


  // Update item in cart
  updateCart(updatedItem: CartItem) {
    if (updatedItem.selectedQty <= 0) {
      this.removeFromCart(updatedItem.id);
      return;
    }

    const cart = this.cartSignal();
    const existingItem = cart.find(i => i.id === updatedItem.id);

    if (existingItem) {
      // Adjust available quantity
      const qtyChange = updatedItem.selectedQty - existingItem.selectedQty;
      existingItem.selectedQty = updatedItem.selectedQty;
      existingItem.availableQty -= qtyChange;

      this.cartSignal.set(cart);
    }
  }

  // Clear cart
  clearCart() {
    this.cartSignal.set([]);
  }

  // Calculate total price
  calculateTotal(): number {
    const cart = this.cartSignal();
    return cart.reduce((total, item) => total + item.price * item.selectedQty, 0);
  }

  // Get current cart items (read-only)
  getCartItems(): CartItem[] {
    return this.cartSignal();
  }

  // Expose the cart signal (for live tracking)
  get cart$() {
    return this.cartSignal.asReadonly(); // Expose as readonly signal
  }

  getMenuItemById(id: number) {
    return this.foods.find((item: { id: number; name: string; price: number; qty: number }) => item.id === id);
  }

  getMenuItems() {
    return of(this.foods); // Wrap the foods array in an observable
  }

}
