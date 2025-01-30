import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './tables/table.component';
import { TableCuComponent } from './tables/table-cu.component';


const routes: Routes = [
  { path: 'table', component: TableComponent },
  { path: 'table/add', component: TableCuComponent },
  { path: 'table/edit/:id', component: TableCuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  // Import the defined routes
  exports: [RouterModule]  // Export RouterModule for use in other modules
})
export class TableManagementRoutingModule { }
