import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./user/user.module').then((m) => m.UserModule) },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule), data: { userType: 'admin' } },
    ]

  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
