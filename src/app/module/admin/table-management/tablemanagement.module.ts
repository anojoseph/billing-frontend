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
import { TableStatusComponent } from './table-stattus/table-status.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    TableCuComponent,
    TableComponent,
    TableStatusComponent
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
    MatProgressSpinnerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatButtonToggleModule
  ]
})
export class TableManagementModule { }
