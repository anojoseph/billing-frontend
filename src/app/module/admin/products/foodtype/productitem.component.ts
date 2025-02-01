import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductItemService } from './productitem.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableComponent } from 'src/app/shared/datatable/data-table.component';

@Component({
  selector: 'app-productitem',
  template: `
    <app-data-table
      #dataTable
      [url]="'ProductItem'"
      [fields]="fields"
      [name]='name'
      (delete)="onDelete($event)"
      [actions]="{ add: true, edit: true, delete: true }">
    </app-data-table>
  `
})
export class ProductItemComponent implements OnInit {
  fields: string[] = ['Name', 'Status'];
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  name = 'Food Type'

  constructor(private productitemsrvice: ProductItemService,
    private toastr:ToastrService
  ) { }

  ngOnInit() { }

  onDelete(id: number): void {
    const confirmation = confirm('Are you sure you want to delete this item?');
    if (!confirmation) {
      return;
    }

    this.productitemsrvice.delete(id).subscribe(
      (response: any) => {
        this.toastr.success('Product item deleted successfully!', 'Success');
        this.dataTable.loadData();  // Refresh the data table
      },
      (error: any) => {
        console.error('Error deleting product item:', error);
        this.toastr.error('Failed to delete the product item. Please try again.', 'Error');
      }
    );
  }

}
