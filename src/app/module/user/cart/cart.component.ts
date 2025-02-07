import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { selectCartCount, selectCartItems, selectCartTotal, selectCartTotalPrice } from './cart.selectors';
import { clearCart, removeFromCart, updateCartItem } from './cart.actions';
import { CartItem } from './cart.model';
import { cartService } from './cart.service'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})

export class CartComponent implements OnInit {
  cart$: Observable<CartItem[]> = this.store.select(selectCartItems);
  cartTotal$: Observable<number> = this.store.select(selectCartTotal);
  cartTotalPrice$: Observable<number> = this.store.select(selectCartTotalPrice);
  tableNumber: any;
  table: any;
  cartCount$: Observable<number>;
  orderType: string = 'Bill';

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private cartService: cartService
  ) {
    this.cartCount$ = this.store.select(selectCartCount);
  }

  ngOnInit(): void {
    this.gettables();
  }

  gettables() {
    this.cartService.gettables().subscribe(
      (resp) => {
        this.table = resp;
      },
      (error) => {
        this.toastr.error(error.message || 'Error fetching table');
      }
    );
  }

  selecttable(type: any): void {
    this.tableNumber = this.tableNumber === type._id ? '' : type._id;
  }

  // Remove item from the cart
  removeFromCart(item: CartItem): void {
    this.store.dispatch(removeFromCart({ productId: item.id }));
  }

  updateQuantity(order: CartItem, change: number): void {
    const updatedQuantity = order.selectedQty + change;
    if (updatedQuantity >= 1) {
      this.store.dispatch(updateCartItem({ productId: order.id, quantity: updatedQuantity }));

    }
  }


  checkoutDisabled(): boolean {
    if (this.orderType === 'Dine-in') {
      return !(this.tableNumber && this.cartCount$);
    }
    return !(this.cartCount$);
  }

  // submitOrder() {
  //   this.cart$.pipe(first()).subscribe(cartItems => {
  //     const orderData = {
  //       tableId: this.tableNumber,
  //       orderType: this.orderType,
  //       items: cartItems
  //     };

  //     this.cartService.createOrder(orderData).subscribe(
  //       (response) => {
  //         this.toastr.success(response.message);
  //         this.store.dispatch(clearCart());
  //       },
  //       (error) => {
  //         this.toastr.error(error.error.message);
  //       }
  //     );
  //   });
  // }

  submitOrder() {
    this.cart$.pipe(first()).subscribe(cartItems => {
      if (!cartItems.length) {
        this.toastr.warning('Cart is empty!');
        return;
      }

      const orderData = {
        tableId: this.orderType === 'Dine-in' ? this.tableNumber : null, // Table required only for Dine-in
        orderType: this.orderType,
        items: cartItems
      };

      this.cartService.createOrder(orderData).subscribe(
        (response) => {
          this.toastr.success(response.message);
          this.store.dispatch(clearCart()); // ✅ Clears the cart state
        },
        (error) => {
          this.toastr.error(error.error.message || 'Failed to create order');
        }
      );
    });
  }


}
