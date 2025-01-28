import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductItemComponent } from './productitem/productitem.component';
import { ProductItemCuComponent } from './productitem/productitem-cu.component';


const routes: Routes = [
  { path: 'productitem', component: ProductItemComponent },
  { path: 'productitem/add', component: ProductItemCuComponent },
  { path: 'productitem/edit/:id', component: ProductItemCuComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Import the defined routes
  exports: [RouterModule]  // Export RouterModule for use in other modules
})
export class ProductRoutingModule { }
