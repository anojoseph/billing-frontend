import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';
import { CartItem } from './cart.model';

// Feature Selector
export const selectCartState = createFeatureSelector<CartState>('cart');

// Select Cart Items
export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

// Select Cart Total Count (total number of items in the cart)
export const selectCartTotal = createSelector(
  selectCartState,
  (state) =>
    state.items.reduce((total, item) => total + item.selectedQty, 0) // Use selectedQty to calculate total count
);

// Select Cart Count (Number of Items in Cart)
export const selectCartCount = createSelector(
  selectCartState,
  (state) => state.items.length
);


// Select Cart Total Price (total price for all items in the cart)
export const selectCartTotalPrice = createSelector(
  selectCartState,
  (state) =>
    state.items.reduce((total, item) => total + item.selectedQty * item.price, 0) // Use selectedQty for price calculation
);
