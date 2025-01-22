import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { LayoutComponent } from './module/user/components/layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: LayoutComponent  },
  // { path: '**', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { userType: 'admin' } },
  // { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { userType: 'user' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
