import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TableStatusService } from './tablestatus.service';

@Component({
  selector: 'app-table-status',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.css'],
})
export class TableStatusComponent implements OnInit {
  tables: any[] = [];
  loading: boolean = false;

  constructor(private tablestatusservice: TableStatusService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getTableStatus();
  }

  getTableStatus() {
    this.tablestatusservice.getTableStatus().subscribe(
      (resp: any) => {
        this.tables = resp.tables;
      },
      (error) => {
        this.toastr.error(error.message || 'Error fetching table status');
      }
    );
  }

  markAsCompleted(orderId: any) {
    this.loading = true;
    this.tablestatusservice.completeOrder(orderId[0]).subscribe(
      (data) => {
        console.log(data)
        this.toastr.success('Order marked as completed');
        this.getTableStatus(); // Refresh the table status
        this.loading = false;;
      },
      (error) => {
        this.toastr.error(error.message || 'Error completing order');
        this.loading = false;
      }
    );
  }
}
