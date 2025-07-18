import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-addon-dialog',
  template: `
    <div style="max-height: 500px; overflow-y: auto; padding: 20px;">
      <h2 style="margin-bottom: 20px;">Select Addons</h2>

      <form [formGroup]="form">
        <div formArrayName="addons">
          <div *ngFor="let addon of addons.controls; let i = index" [formGroupName]="i"
               style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; gap: 15px;">

            <div style="flex: 1;">
              <strong>{{ addon.value.name }}</strong> <br>
              <small style="color: #666;">₹{{ addon.value.price }}</small>
            </div>

           <div style="display: flex; align-items: center; gap: 5px;">
            <button class="btn btn-sm btn-outline-danger" (click)="decrementQty(i)">−</button>
            <span>{{ addon.get('qty')?.value }}</span>
            <button class="btn btn-sm btn-outline-danger" (click)="incrementQty(i)">+</button>
          </div>

          </div>
        </div>
      </form>

      <div style="text-align: right; margin-top: 30px;">
        <button mat-stroked-button color="warn" (click)="dialogRef.close()">Cancel</button>
        <button mat-flat-button color="primary" style="margin-left: 10px;" (click)="confirmSelection()">Add</button>
      </div>
    </div>
  `,
})
export class AddonDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      addons: this.fb.array([])
    });

    this.initAddons(data.addons);
  }

  get addons(): FormArray {
    return this.form.get('addons') as FormArray;
  }

  initAddons(addons: any[]) {
    addons.forEach((addon) => {
      this.addons.push(
        this.fb.group({
          name: [addon.name],
          price: [addon.price],
          qty: [addon.qty ?? 1]  // ⬅️ Use existing qty if available, fallback to 1
        })
      );
    });
  }


  confirmSelection() {
    const selectedAddons = this.addons.value.filter((addon: any) => addon.qty > 0);
    this.dialogRef.close(selectedAddons);
  }

  incrementQty(index: number) {
    const control = this.addons.at(index);
    const current = control.get('qty')?.value || 0;
    control.get('qty')?.setValue(current + 1);
  }

  decrementQty(index: number) {
    const control = this.addons.at(index);
    const current = control.get('qty')?.value || 0;
    if (current > 0) {
      control.get('qty')?.setValue(current - 1);
    }
  }

}
