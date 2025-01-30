import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {path: 'product',loadChildren: () => import('./products/product.module').then(m => m.ProductModule)},
  { path: 'table', loadChildren: () => import('./table-management/tablemanagement.module').then(m => m.TableManagementModule) }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
