import { Component, OnInit, ViewChild } from '@angular/core';
import { MealtypeService } from './mealtype.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableComponent } from 'src/app/shared/datatable/data-table.component';

@Component({
  selector: 'app-mealtype',
  template: `
    <app-data-table
      #dataTable
      [url]="'MealType'"
      [fields]="fields"
      [name]="name"
      (delete)="onDelete($event)"
      [actions]="{ add: true, edit: true, delete: true }">
    </app-data-table>
  `
})
export class MealTypeComponent implements OnInit {
  fields: string[] = ['Name', 'Status'];
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  name='Meal Type'

  constructor(private mealtypeservice: MealtypeService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  onDelete(id: number): void {
    const confirmation = confirm('Are you sure you want to delete this item?');
    if (!confirmation) {
      return;
    }

    this.mealtypeservice.delete(id).subscribe(
      (response: any) => {
        this.toastr.success('Meal type deleted successfully!', 'Success');
        this.dataTable.loadData();  // Refresh the data table
      },
      (error: any) => {
        this.toastr.error('Failed to delete the Meal Type. Please try again.', 'Error');
      }
    );
  }

}
