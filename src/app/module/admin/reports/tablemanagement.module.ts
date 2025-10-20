import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reportRoutingModule } from './report-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SalesReportComponent } from './bill-wise/sales-report.component';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { ItemWiseSalesReportComponent } from './itemwise/sales-report.component';
import { DayWiseReportComponent } from './day-wise/day-wise-report.component';
import { BillEditReportComponent } from './bill-edit/bill-edit-report.component';
import { BillHistoryModalComponent } from './bill-edit/bill-history-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    SalesReportComponent,
    ItemWiseSalesReportComponent,
    DayWiseReportComponent,
    BillEditReportComponent,
    BillHistoryModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    reportRoutingModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ]
})
export class reportModule { }
