import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillUpdateComponent } from './bill-update.component';



const routes: Routes = [
  { path: 'bill-edit', component: BillUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
