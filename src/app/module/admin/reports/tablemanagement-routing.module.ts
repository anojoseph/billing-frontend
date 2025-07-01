import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportComponent } from './daywise/sales-report.component';
import { ItemWiseSalesReportComponent } from './itemwise/sales-report.component';


const routes: Routes = [
  { path: 'sales-reprt', component: SalesReportComponent },
  { path: 'item-wise-sales-reprt', component: ItemWiseSalesReportComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class reportRoutingModule { }
