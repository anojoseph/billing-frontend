import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemComponent } from './productitem/productitem.component';
import { ProductItemCuComponent } from './productitem/productitem-cu.component';
import { MealTypeComponent } from './meal-type/mealtype.component';
import { MealTypeCuComponent } from './meal-type/mealtype-cu.component';


const routes: Routes = [
  { path: 'productitem', component: ProductItemComponent },
  { path: 'productitem/add', component: ProductItemCuComponent },
  { path: 'productitem/edit/:id', component: ProductItemCuComponent },

  { path: 'mealtype', component: MealTypeComponent },
  { path: 'mealtype/add', component: MealTypeCuComponent },
  { path: 'mealtype/edit/:id', component: MealTypeCuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Import the defined routes
  exports: [RouterModule]  // Export RouterModule for use in other modules
})
export class ProductRoutingModule { }
