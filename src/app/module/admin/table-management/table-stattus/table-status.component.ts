import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TableStatusService } from './tablestatus.service';
import { PaymentTypeDialogComponent } from 'src/app/module/user/payment-dialog/payment-type-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-table-status',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.css'],
})
export class TableStatusComponent implements OnInit {
  tables: any[] = [];
  loading: boolean = false;

  constructor(private tablestatusservice: TableStatusService, private toastr: ToastrService, private dialog: MatDialog) { }

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

markAsCompleted(orderIds: any[]) {
  const dialogRef = this.dialog.open(PaymentTypeDialogComponent, {
    width: '300px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(paymentType => {
    if (!paymentType) return;

    this.loading = true;
    this.tablestatusservice.completeOrder(orderIds[0], paymentType).subscribe(
      (data) => {
        this.toastr.success('Order marked as completed');
        this.getTableStatus();
        this.loading = false;
      },
      (error) => {
        this.toastr.error(error.message || 'Error completing order');
        this.loading = false;
      }
    );
  });
}

}
