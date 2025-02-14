import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from 'src/app/shared/datatable/data-table.component';
import { ProductItemService } from '../../products/foodtype/productitem.service';
import { ToastrService } from 'ngx-toastr';
import { KitchenService } from './kitchen.service';

@Component({
  selector: 'app-table',
  template: `
   <app-data-table
      #dataTable
      [url]="'Kitchen'"
      [fields]="fields"
      [name]='name'
      (delete)="onDelete($event)"
      [actions]="{ add: true, edit: true, delete: true }">
    </app-data-table>
  `
})

export class KitchenComponent implements OnInit {
  fields: string[] = ['Table No:', 'Name', 'Status', "Qr code"];
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  name = 'Tables'


  constructor(private kitchenservice: KitchenService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  onDelete(id: number): void {
    const confirmation = confirm('Are you sure you want to delete table?');
    if (!confirmation) {
      return;
    }

    this.kitchenservice.delete(id).subscribe(
      (response: any) => {
        this.toastr.success('Deleted successfully!', 'Success');
        this.dataTable.loadData();  // Refresh the data table
      },
      (error: any) => {
        console.error('Error deleting table:', error);
        this.toastr.error('Failed to delete. Please try again.', 'Error');
      }
    );
  }

}
