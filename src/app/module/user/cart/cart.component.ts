import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { selectCartCount, selectCartItems, selectCartTotal, selectCartTotalPrice } from './cart.selectors';
import { removeFromCart, updateCartItem } from './cart.actions';
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
    return !(this.tableNumber && this.cartCount$);
  }

}

