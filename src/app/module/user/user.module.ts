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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddonDialogComponent } from './food-menu/addon-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from "@angular/material/core";


@NgModule({
  declarations: [
    FoodMenuComponent,
    CartComponent,
    AddonDialogComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatCardModule,
    SharedModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatOptionModule
],
})
export class UserModule { }
