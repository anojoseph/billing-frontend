import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { LogoutComponent } from './shared/login/logout.component';
import { AuthGuard } from './shared/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./module/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
