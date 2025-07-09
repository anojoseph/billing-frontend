import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCartCount } from 'src/app/module/user/cart/cart.selectors';
import { MenuItem, MENU_ITEMS } from '../menu/menu.config';
import { MenuService } from '../menu/menu.service';
import { SettingsService } from 'src/app/module/admin/settings/general-settings/generasetting/generasettings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartCount$: Observable<number>;
  userType: string | null = null;
  menuItems: MenuItem[] = [];
  userRole: string | null = null;
  storename: any;

  ngOnInit(): void {
    this.userRole = this.authService.getUserType();
    this.getmenu();
    this.settings.getSettings().subscribe((resp: any) => {
      this.storename = resp?.storeName || 'Billing.Com'
    })
  }

  constructor(
    private router: Router,
    public authService: AuthService,
    private store: Store,
    private menuservice: MenuService,
    private settings: SettingsService
  ) {
    this.cartCount$ = this.store.select(selectCartCount);
  }
  //cart$ = this.cartService.cart$;

  getmenu() {
    this.menuservice.getallmenu().subscribe((resp: any) => {
      this.menuItems = resp
    })
  }
  onCloseSidenav() {
  }

  hasAccess(roles: string[]): boolean {
    return roles.includes(this.userType ?? '');
  }


  viewProfile() {
    this.router.navigate(['profile']);
  }

  logout() {
    this.router.navigate(['/logout'])
  }

  opencart() {
    this.router.navigate(['/cart'])
  }
}
