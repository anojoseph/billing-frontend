import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-payment-type-dialog',
    template: `
    <h2 mat-dialog-title>Select Payment Type</h2>
    <mat-dialog-content>
      <mat-radio-group [(ngModel)]="selectedPaymentType">
        <mat-radio-button *ngFor="let type of paymentTypes" [value]="type">
          {{ type }}
        </mat-radio-button>
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="submit()" [disabled]="!selectedPaymentType">Confirm</button>
    </mat-dialog-actions>
  `
})
export class PaymentTypeDialogComponent {
    paymentTypes = ['Cash', 'UPI', 'Card', 'Swiggy', 'Zomato', 'Other'] ;
    selectedPaymentType: string = this.data?.defaultType || 'Cash';

    constructor(
        public dialogRef: MatDialogRef<PaymentTypeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close(this.selectedPaymentType);
    }
}
