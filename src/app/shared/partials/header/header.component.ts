import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCartCount } from 'src/app/module/user/cart/cart.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  cartCount$: Observable<number> ;

  constructor(
    private router: Router,
    public authService: AuthService,
    private store: Store
  ) {
    this.cartCount$ = this.store.select(selectCartCount);
   }
  //cart$ = this.cartService.cart$;

  onCloseSidenav() {
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
