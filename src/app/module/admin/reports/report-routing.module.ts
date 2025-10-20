import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReportComponent } from './bill-wise/sales-report.component';
import { ItemWiseSalesReportComponent } from './itemwise/sales-report.component';
import { DayWiseReportComponent } from './day-wise/day-wise-report.component';
import { BillEditReportComponent } from './bill-edit/bill-edit-report.component';


const routes: Routes = [
  { path: 'sales-reprt', component: SalesReportComponent },
  { path: 'item-wise-sales-reprt', component: ItemWiseSalesReportComponent },
  { path: 'day-wise', component: DayWiseReportComponent },
  { path: 'bill-edit', component: BillEditReportComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class reportRoutingModule { }
