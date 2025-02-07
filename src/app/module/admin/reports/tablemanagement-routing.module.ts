import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportComponent } from './daywise/sales-report.component';


const routes: Routes = [
  { path: 'sales-reprt', component: SalesReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class reportRoutingModule { }
