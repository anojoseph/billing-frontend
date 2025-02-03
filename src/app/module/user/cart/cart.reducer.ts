import { createReducer, on } from '@ngrx/store';
import { addToCart, removeFromCart, updateCartItem, clearCart } from './cart.actions';
import { CartItem } from './cart.model';

// Initial State
export interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: [],
};

// Reducer Function
export const cartReducer = createReducer(
  initialState,

  // Add to Cart
  on(addToCart, (state, { item }) => {
    const existingItem = state.items.find(i => i.id === item.id);

    if (existingItem) {
      // ✅ Update selectedQty if the item is already in the cart
      return {
        ...state,
        items: state.items.map(i =>
          i.id === item.id ? { ...i, selectedQty: i.selectedQty + item.selectedQty } : i
        ),
      };
    }

    // ✅ Add a new item if it’s not already in the cart
    return {
      ...state,
      items: [...state.items, { ...item, selectedQty: item.selectedQty }],
    };
  }),

  // Remove from Cart
  on(removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.id !== productId),
  })),

  // Update Quantity
  on(updateCartItem, (state, { productId, quantity }) => ({
    ...state,
    items: state.items.map(item =>
      item.id === productId ? { ...item, selectedQty: quantity } : item
    ),
  })),

  // Clear Cart
  on(clearCart, (state) => ({
    ...state,
    items: [],
  }))
);
