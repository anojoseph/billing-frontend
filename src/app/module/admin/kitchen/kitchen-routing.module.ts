import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KitchenComponent } from './kitchen/kitchen.component';
import { KitchenCuComponent } from './kitchen/kitchen-cu.component';


const routes: Routes = [
  { path: 'kitchen', component: KitchenComponent },
  { path: 'kitchen/add', component: KitchenCuComponent },
  { path: 'kitchen/edit/:id', component: KitchenCuComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Import the defined routes
  exports: [RouterModule]  // Export RouterModule for use in other modules
})
export class KitchenRoutingModule { }
