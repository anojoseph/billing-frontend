import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  showMenu: boolean = true; // Tracks if the menu is visible
  isMobile: boolean = false; // Tracks if the device is mobile
  cart$ = this.cartService.cart$;

  constructor(private cartService: CartService){}
  ngOnInit(): void {
    this.checkDeviceWidth();
    // Dynamically check the screen size on window resize
    window.addEventListener('resize', this.checkDeviceWidth.bind(this));
  }

  // Determine whether the current view is mobile
  checkDeviceWidth(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      // On desktop, always show both menu and order summary
      this.showMenu = true;
    }
  }

  // Toggle between menu and order summary on mobile
  toggleView(): void {
    if (this.isMobile) {
      this.showMenu = !this.showMenu; // Switch between the two
      console.log('Toggled View:', this.showMenu ? 'Showing Menu' : 'Showing Order Summary');
    }
  }

  getCartItemCount(): number {
    const cartItems = this.cart$();  // Access the value of the Signal
    return cartItems.reduce((total, item) => total + item.selectedQty, 0);  // Use reduce on the array
  }
}
