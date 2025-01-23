import { Component, effect, EventEmitter, inject, Injector, OnInit, Output, runInInjectionContext } from '@angular/core'; // Import Injector
import { CartService } from '../cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent implements OnInit {
  cart$ = this.cartService.cart$;
  tableNumber: any;
  cartItems: any[] = [];
  availableQty: Record<number, number> = {};

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // Access the signal value directly
    this.availableQty = this.cartService.availableQty$();
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item.id);
    this.cartItems = this.cartService.getCartItems();
  }

  calculateTotal() {
    return this.cartService.calculateTotal();
  }

  updateQuantity(order: any, change: number) {
    const newQuantity = order.selectedQty + change;
    const foodInMenu = this.cartService.getMenuItemById(order.id);

    if (foodInMenu) {
      const availableQty = foodInMenu.qty - foodInMenu.selectedQty;

      if (newQuantity > 0 && newQuantity <= foodInMenu.qty) {
        this.cartService.updateCart({ ...order, selectedQty: newQuantity });
      } else if (newQuantity > foodInMenu.qty) {
        alert(`Only ${foodInMenu.qty} items are available in stock.`);
      }
    }
  }

}
