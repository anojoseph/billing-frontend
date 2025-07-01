import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuFormComponent } from 'src/app/shared/partials/menu/menu-form.component';


const routes: Routes = [
  { path: 'product', loadChildren: () => import('./products/product.module').then(m => m.ProductModule) },
  { path: 'table', loadChildren: () => import('./table-management/tablemanagement.module').then(m => m.TableManagementModule) },
  { path: 'settings', loadChildren: () => import('./settings/setting.module').then(m => m.SettingsModule) },
  { path: 'reports', loadChildren: () => import('./reports/tablemanagement.module').then(m => m.reportModule) },
  { path: 'bill', loadChildren: () => import('./Bill/bill.module').then(m => m.BillModule) },
  { path: 'kitchen', loadChildren: () => import('./kitchen/kitchen.module').then(m => m.KitchenModule) },
  { path: 'menu', component: MenuFormComponent },
  { path: 'menu/edit/:id', component: MenuFormComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
