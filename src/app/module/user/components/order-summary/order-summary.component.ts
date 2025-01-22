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
    if (newQuantity > 0) {
      this.syncStock(order, change); // Adjust stock
      this.cartService.updateCart({ ...order, selectedQty: newQuantity });
    }
  }

  // Direct update of item quantity
  // updateCart(item: any, newQuantity: number) {
  //   const menuItem = this.cartService.getMenuItemById(item.id);
  //   if (newQuantity > 0 && newQuantity <= menuItem.qty) {
  //     const quantityChange = newQuantity - item.selectedQty;
  //     this.syncStock(item, quantityChange); // Adjust stock
  //     this.cartService.updateCart({ ...item, selectedQty: newQuantity });
  //   } else {
  //     alert('Invalid quantity! Ensure it is greater than 0 and within available stock.');
  //   }
  // }

  syncStock(item: any, change: number) {
    const foodInMenu = this.cartService.getMenuItemById(item.id);
    if (foodInMenu) {
      foodInMenu.qty -= change; // Adjust stock based on quantity change
    }
  }

}
