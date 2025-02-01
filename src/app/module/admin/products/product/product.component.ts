import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataTableComponent } from 'src/app/shared/datatable/data-table.component';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  template: `
    <app-data-table
      #dataTable
      [url]="'Product'"
      [fields]="fields"
      [name]="name"
      (delete)="onDelete($event)"
      [actions]="{ add: true, edit: true, delete: true }">
    </app-data-table>
  `
})
export class ProductComponent implements OnInit {
  fields: string[] = ['Name','Price', 'Status'];
  @ViewChild('dataTable') dataTable!: DataTableComponent;
  name = 'Product'

  constructor(private ProductService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  onDelete(id: number): void {
    const confirmation = confirm('Are you sure you want to delete this item?');
    if (!confirmation) {
      return;
    }

    this.ProductService.delete(id).subscribe(
      (response: any) => {
        this.toastr.success('Product deleted successfully!', 'Success');
        this.dataTable.loadData();  // Refresh the data table
      },
      (error: any) => {
        this.toastr.error('Failed to delete the product. Please try again.', 'Error');
      }
    );
  }

}
