import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductItemComponent } from './productitem/productitem.component';
import { ProductItemCuComponent } from './productitem/productitem-cu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MealTypeCuComponent } from './meal-type/mealtype-cu.component';
import { MealTypeComponent } from './meal-type/mealtype.component';

@NgModule({
  declarations: [
    ProductItemComponent,
    ProductItemCuComponent,
    MealTypeCuComponent,
    MealTypeComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class ProductModule { }
