import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';

export interface CartItem {
  id: any;
  name: string;
  price: number;
  selectedQty: number;
  availableQty: number;
}

export interface Food {
  id: any;
  name: string;
  price: number;
  qty: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  
  private cartSignal = signal<CartItem[]>([]);
  private availableQtySignal = signal<Record<number, number>>({});

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

  constructor() {
    const initialQty = this.foods.reduce((acc, food) => {
      acc[food.id] = food.qty;
      return acc;
    }, {} as Record<number, number>);
    this.availableQtySignal.set(initialQty);
  }

  calculateTotal(): number {
    const cart = this.cartSignal();
    return cart.reduce((total, item) => total + item.price * item.selectedQty, 0);
  }

  getMenuItemById(id: number) {
    return this.foods.find((item) => item.id === id);
  }

  updateCart(updatedItem: CartItem) {
    if (updatedItem.selectedQty <= 0) {
      this.removeFromCart(updatedItem.id);
      return;
    }
    const cart = this.cartSignal();
    const existingItem = cart.find(i => i.id === updatedItem.id);
    if (existingItem) {
      const qtyChange = updatedItem.selectedQty - existingItem.selectedQty;
      existingItem.selectedQty = updatedItem.selectedQty;
      this.updateAvailableQty(updatedItem.id, -qtyChange);
      this.cartSignal.set(cart);
    }
  }

  addToCart(item: CartItem) {
    if (item.selectedQty <= 0 || item.price < 0) {
      throw new Error('Invalid item data');
    }
    const cart = this.cartSignal();
    const existingItem = cart.find((i) => i.id === item.id);
    const availableQty = this.availableQtySignal()[item.id];
    if (availableQty < item.selectedQty) {
      throw new Error('Not enough stock available');
    }
    if (existingItem) {
      existingItem.selectedQty += item.selectedQty;
    } else {
      cart.push({ ...item });
    }
    this.updateAvailableQty(item.id, -item.selectedQty);
    this.cartSignal.set(cart);
  }

  removeFromCart(itemId: string | number) {
    const cart = this.cartSignal();
    const itemToRemove = cart.find((i) => i.id === itemId);
    if (itemToRemove) {
      this.updateAvailableQty(itemToRemove.id, itemToRemove.selectedQty);
      const updatedCart = cart.filter((i) => i.id !== itemId);
      this.cartSignal.set(updatedCart);
    }
  }

  private updateAvailableQty(itemId: number, change: number) {
    const currentQty = this.availableQtySignal()[itemId] || 0;
    const newQty = currentQty + change;
    this.availableQtySignal.update((qty) => ({ ...qty, [itemId]: newQty }));
  }

  get availableQty$() {
    return this.availableQtySignal.asReadonly();
  }

  getCartItems() {
    return this.cartSignal();
  }

  get cart$() {
    return this.cartSignal.asReadonly();
  }

  getMenuItems() {
    return of(this.foods);
  }
}
