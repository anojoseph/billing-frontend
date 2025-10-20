import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-bill-history-modal',
    template: `
    <h2 mat-dialog-title>Bill Edit History - {{ data.billNumber }}</h2>

    <mat-dialog-content style="max-height: 500px; overflow-y: auto;">
      <table class="table table-bordered" style="width: 100%; border-collapse: collapse;">
        <thead style="background: #f5f5f5;">
          <tr>
            <th>Edit Date</th>
            <th>Edited By</th>
            <th>Previous Total</th>
            <th>Updated Total / Grand</th>
            <th>Payment Type</th>
            <th>Items</th>
          </tr>
        </thead>

        <tbody>
          <tr
            *ngFor="let item of data.history; let i = index"
            [ngClass]="{ 'latest-edit': i === 0, 'old-edit': i !== 0 }"
          >
            <td>{{ item.editedAt  | date:'dd/MM/yyyy hh:mm:ss a' }}</td>
            <td>{{ item.editedBy || 'Unknown' }}</td>
            <td>₹{{ item.previousTotal || 0 }}</td>
            <td>₹{{ item.updatedTotal || 0 }} / ₹{{ item.updatedGrandTotal || 0 }}</td>
            <td>{{ item.paymentType || '-' }}</td>

            <!-- Items -->
            <td>
              <div *ngFor="let i of item.items" class="item-line">
                <div>
                  <strong>{{ i.name || i.id }}</strong> -
                  Qty: {{ i.quantity }},
                  ₹{{ i.price }}
                  (Total ₹{{ i.totalPrice }})
                </div>

                <div *ngIf="i.addons?.length > 0" class="addon-line">
                  <div *ngFor="let addon of i.addons">
                    ➤ {{ addon.name }} × {{ addon.qty }} — ₹{{ addon.price }}
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr *ngIf="!data.history || data.history.length === 0">
            <td colspan="6" style="text-align: center; color: red;">No edit history</td>
          </tr>
        </tbody>
      </table>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .latest-edit {
      background-color: #e8f9e8 !important; /* light green */
      color: #0a8a0a;
      font-weight: 500;
    }

    .old-edit {
      background-color: #fdeaea !important; /* light red */
      color: #a10f0f;
      text-decoration: line-through;
      opacity: 0.7;
    }

    .addon-line {
      font-size: 13px;
      color: #555;
      margin-left: 10px;
    }

    .item-line {
      margin-bottom: 6px;
    }
  `]
})
export class BillHistoryModalComponent {
    constructor(
        public dialogRef: MatDialogRef<BillHistoryModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { billNumber: string; history: any[] }
    ) {}

    close() {
        this.dialogRef.close();
    }
}
