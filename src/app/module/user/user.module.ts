import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoutingModule } from './user.routing.module';
import { FoodMenuComponent } from './food-menu/food-menu.component';
import { CartComponent } from './cart/cart.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    FoodMenuComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatCardModule,
    SharedModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule
  ],
})
export class UserModule { }
