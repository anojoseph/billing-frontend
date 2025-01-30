import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableManagementRoutingModule } from './tablemanagement-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TableCuComponent } from './tables/table-cu.component';
import { TableComponent } from './tables/table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    TableCuComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    TableManagementRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class TableManagementModule { }
