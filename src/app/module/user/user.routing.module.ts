import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodMenuComponent } from './food-menu/food-menu.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: FoodMenuComponent },
  { path: 'cart', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
