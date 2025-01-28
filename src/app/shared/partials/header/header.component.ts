import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/module/user/cart.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private cartService: CartService,
    private router: Router,
    public authService: AuthService,
  ) { }
  cart$ = this.cartService.cart$;
  onCloseSidenav() {
  }

  getCartItemCount(): number {
    const cartItems = this.cart$();
    return cartItems.reduce((total, item) => total + item.selectedQty, 0);
  }

  viewProfile() {
    console.log("Navigating to Profile");
  }

  logout() {
    this.router.navigate(['/logout'])
  }

  opencart() {
    this.router.navigate(['/cart'])
  }
}
