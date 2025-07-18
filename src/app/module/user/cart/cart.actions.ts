import { createAction, props } from '@ngrx/store';
import { CartItem } from './cart.model';

// Action to add a product to the cart
export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ item: CartItem }>()
);

// Action to remove a product from the cart
export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: string }>()
);

// Action to update quantity
// export const updateCartItem = createAction(
//   '[Cart] Update Item',
//   props<{ productId: string; quantity: number }>()
// );

// Action to clear the cart
export const clearCart = createAction('[Cart] Clear Cart');

export const updateCartItem = createAction(
  '[Cart] Update Cart Item',
  props<{ productId: string; quantity?: number; addons?: any[] }>()
);