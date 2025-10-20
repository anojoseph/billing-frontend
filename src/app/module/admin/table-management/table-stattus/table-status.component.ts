import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TableStatusService } from './tablestatus.service';
import { PaymentTypeDialogComponent } from 'src/app/module/user/payment-dialog/payment-type-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../../settings/general-settings/generasetting/generasettings.service';

@Component({
  selector: 'app-table-status',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.css'],
})
export class TableStatusComponent implements OnInit {
  tables: any[] = [];
  tableLoading: { [key: string]: boolean } = {};

  // ✅ Tax from settings
  sgst: number = 0;
  cgst: number = 0;
  taxstatus: any;

  // ✅ Per-table discount
  tableDiscounts: {
    [tableId: string]: {
      discountType: 'percentage' | 'amount';
      discountValue: number;
    };
  } = {};

  constructor(
    private tablestatusservice: TableStatusService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.getTableStatus();
    this.getTaxRates();
  }

  getTableStatus() {
    this.tablestatusservice.getTableStatus().subscribe(
      (resp: any) => {
        this.tables = resp.tables;

        for (const table of this.tables) {
          if (!this.tableDiscounts[table.tableId]) {
            this.tableDiscounts[table.tableId] = {
              discountType: 'percentage',
              discountValue: 0,
            };
          }
        }
      },
      (error) => {
        this.toastr.error(error.message || 'Error fetching table status');
      }
    );
  }

  getTaxRates() {
    this.settingsService.getSettings().subscribe(
      (data: any) => {
        this.taxstatus = data?.tax_status || false;
        if (data?.tax_status) {
          this.sgst = data?.sgst || 0;
          this.cgst = data?.cgst || 0;
        }
      },
      (error) => {
        this.toastr.error('Failed to load settings');
      }
    );
  }

  markAsCompleted(orderIds: any[], tableId: string) {
    const dialogRef = this.dialog.open(PaymentTypeDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((paymentType) => {
      if (!paymentType) return;

      this.tableLoading[tableId] = true;

      const discountData = this.tableDiscounts[tableId] || {
        discountType: 'percentage',
        discountValue: 0,
      };

      this.tablestatusservice.completeOrder(orderIds[0], {
        paymentType,
        discountType: discountData.discountType,
        discountValue: discountData.discountValue
      }).subscribe(() => {
        this.toastr.success('Order marked as completed');
        this.getTableStatus();
      },
        (error) => {
          this.toastr.error(error.message || 'Error completing order');
        },
        () => {
          this.tableLoading[tableId] = false;
        }
      );
    });
  }

  getBillBreakdown(amount: number, tableId: string) {
    const sgstAmount = (this.sgst / 100) * amount;
    const cgstAmount = (this.cgst / 100) * amount;
    const taxTotal = sgstAmount + cgstAmount;
    const grossAmount = amount + taxTotal;

    const discountInfo = this.tableDiscounts[tableId] || {
      discountType: 'percentage',
      discountValue: 0,
    };

    let discountAmount = 0;
    if (discountInfo.discountType === 'percentage') {
      discountAmount = (discountInfo.discountValue / 100) * grossAmount;
    } else {
      discountAmount = discountInfo.discountValue;
    }

    const discountedAmount = Math.max(grossAmount - discountAmount, 0);
    const roundOff = Math.round(discountedAmount) - discountedAmount;
    const finalTotal = Math.round(discountedAmount);

    return {
      base: amount,
      sgstAmount,
      cgstAmount,
      taxTotal,
      grossAmount,
      discountAmount,
      discountedAmount,
      roundOff,
      finalTotal,
    };
  }
}
