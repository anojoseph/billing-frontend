import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { LogoutComponent } from './shared/login/logout.component';
import { FoodMenuComponent } from './module/user/components/food-menu/food-menu.component';
import { OrderSummaryComponent } from './module/user/components/order-summary/order-summary.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'menu', component: FoodMenuComponent  },
  { path: 'cart', component: OrderSummaryComponent },
  // { path: '**', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { userType: 'admin' } },
  // { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { userType: 'user' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
