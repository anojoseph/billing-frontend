import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-type-dialog',
  template: `
    <h2 mat-dialog-title>Select Payment Type</h2>
    <mat-dialog-content>
      <div class="payment-options-grid">
        <div
          *ngFor="let type of paymentTypes"
          class="payment-card"
          [class.selected]="selectedPaymentType === type"
          (click)="selectedPaymentType = type"
        >
          <mat-icon>{{ getPaymentIcon(type) }}</mat-icon>
          <span class="payment-name">{{ type }}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="submit()"
        [disabled]="!selectedPaymentType">
        Confirm
      </button>
    </mat-dialog-actions>

<style>
    .payment-options-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px 0;
  }

  .payment-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background-color: #f9f9f9;

    mat-icon {
      font-size: 40px;
      height: 40px;
      width: 40px;
      margin-bottom: 8px;
      color: #607d8b;
    }

    .payment-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    &.selected {
      border-color: #3f51b5;
      background-color: #e8eaf6;
      box-shadow: 0 0 0 2px #3f51b5;

      mat-icon, .payment-name {
        color: #3f51b5;
        font-weight: bold;
      }
  }
}
</style>
  `,

})
export class PaymentTypeDialogComponent {
  paymentTypes = ['Cash', 'UPI', 'Card', 'Swiggy', 'Zomato', 'Other'];
  selectedPaymentType: string = this.data?.defaultType || 'Cash';

  constructor(
    public dialogRef: MatDialogRef<PaymentTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    // Optional: Register custom icons if needed, e.g., for UPI.
    this.matIconRegistry.addSvgIcon(
      'upi',
      this.domSanitizer.bypassSecurityTrustResourceUrl('path/to/upi-icon.svg')
    );
  }

  getPaymentIcon(type: string): string {
    switch (type) {
      case 'Cash':
        return 'attach_money';
      case 'UPI':
        return 'payment'; // Or use 'upi' if you've registered a custom icon
      case 'Card':
        return 'credit_card';
      case 'Swiggy':
        return 'restaurant';
      case 'Zomato':
        return 'delivery_dining';
      case 'Other':
        return 'more_horiz';
      default:
        return 'help_outline';
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.selectedPaymentType);
  }
}
