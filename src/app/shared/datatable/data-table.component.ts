import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() url: string = '';
  @Input() actions: { add: boolean; edit: boolean; delete: boolean } = { add: true, edit: true, delete: true };
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Input() fields: string[] = [];

  columns: string[] = [];
  dataSource: any[] = [];
  pagination: any = {};
  currentPage: number = 1;
  pageSize: number = 10;

  searchValue: string = '';
  selectedRow: any = null; // Store the selected row

  constructor(private dataService: DataService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.url) {
      this.loadData();
    }
  }

  loadData(): void {
    if (!this.url) return;

    this.dataService
      .getItems(
        this.url,
        this.searchValue,
        this.currentPage,
        this.pageSize
      )
      .subscribe((response) => {
        console.log(response);
        this.dataSource = response.items.map((item: any, index: number) => ({
          ...item,
          index: this.currentPage > 1 ? (this.currentPage - 1) * this.pageSize + index + 1 : index + 1,
        }));
        this.pagination = response.pagination;

        if (this.dataSource.length > 0) {
          this.columns = Object.keys(this.dataSource[0]).filter((column) => column !== 'id' && column !== 'index');
        }
        console.log(this.dataSource.length)
      },
        (error) => {
          console.error(error);
        });
  }

  onAdd() {
    const currentUrl = this.router.url;
    this.router.navigate([`/${currentUrl}/add`]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadData();
  }

  toggleRowSelection(row: any, event: any): void {
    if (event.checked) {
      this.selectedRow = row; // Set selected row
    } else {
      this.selectedRow = null; // Unselect row
    }
  }

  onEditSelected(): void {
    if (this.selectedRow) {
      const currentUrl = this.router.url;
      this.router.navigate([`/${currentUrl}/edit`, this.selectedRow.id]);
    }
  }

  // Method to delete the selected row
  onDeleteSelected(): void {
    console.log("it is working")
    if (this.selectedRow && this.selectedRow.id) {
      console.log("second if is working")
      this.delete.emit(this.selectedRow.id); // Emit the selected row's id
    } else {
      console.error('No row selected for deletion.');
    }
  }


}
