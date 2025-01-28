import { Component } from '@angular/core';
import { CartService } from 'src/app/module/user/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private cartService: CartService){}

  cart$ = this.cartService.cart$;
  onCloseSidenav() {
    // Additional logic can go here
    console.log('Sidenav closed');
  }

  getCartItemCount(): number {
    const cartItems = this.cart$();  // Access the value of the Signal
    return cartItems.reduce((total, item) => total + item.selectedQty, 0);  // Use reduce on the array
  }
}
