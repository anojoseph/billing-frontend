import { createSelector, createFeatureSelector, createAction, props } from '@ngrx/store';
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

export const selectCartTotalPrice = createSelector(
  selectCartItems,
  (items: CartItem[]) =>
    items.reduce((total, item) => {
      const addonsTotal = item.addons?.reduce(
        (sum, addon) => sum + (addon.price * (addon.qty || 1)),
        0
      ) || 0;

      const itemTotal = item.price * (item.selectedQty || 1);

      return total + itemTotal + addonsTotal;
    }, 0)
);





