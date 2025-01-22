import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent implements OnInit {
  // Access the cart signal directly
  cart$ = this.cartService.cart$; // Signal for live cart updates
  tableNumber: any;

  constructor(private cartService: CartService) { }

  ngOnInit(): void { }

  // Remove item from cart
  removeFromCart(item: any) {
    this.cartService.removeFromCart(item.id);
    const foodInMenu = this.cartService.getMenuItemById(item.id);
    if (foodInMenu) {
      foodInMenu.qty += item.selectedQty; // Restore the stock
    }
  }


  // Calculate total
  calculateTotal() {
    return this.cartService.calculateTotal();
  }

  // Increment or decrement quantity in the cart
  updateQuantity(order: any, change: number) {
    const newQuantity = order.selectedQty + change;
    const foodInMenu = this.cartService.getMenuItemById(order.id);

    if (foodInMenu) {
      const availableQty = foodInMenu.qty - foodInMenu.selectedQty; // Calculate dynamically

      // Ensure the quantity does not exceed available stock and is greater than 0
      if (newQuantity > 0 && newQuantity <= foodInMenu.qty) {
        this.cartService.updateCart({ ...order, selectedQty: newQuantity });
      } else if (newQuantity > foodInMenu.qty) {
        alert(`Only ${foodInMenu.qty} items are available in stock.`);
      }
    }
  }


  syncStock(item: any, change: number) {
    const foodInMenu = this.cartService.getMenuItemById(item.id);
    if (foodInMenu) {
      // Do not modify the original qty here
      foodInMenu.qty = foodInMenu.qty - (foodInMenu.selectedQty + change);
    }
  }

}
