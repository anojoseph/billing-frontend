import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerasettingComponent } from './general-settings/generasetting/generasetting.component';


const routes: Routes = [
  { path: '', component: GenerasettingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
