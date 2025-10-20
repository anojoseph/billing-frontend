import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../settings/general-settings/generasetting/generasettings.service';

@Component({
  selector: 'app-bill-update',
  templateUrl: './bill-update.component.html',
  styleUrls: ['./bill-update.component.css']
})
export class BillUpdateComponent implements OnInit {
  billForm!: FormGroup;
  products: any[] = [];
  totalAmount = 0;
  discountAmount = 0;
  taxAmount = 0;
  grandTotal = 0;
  isLoading = false;
  sgst: any = 0;
  cgst: any = 0;
  igst: any = 0;
  taxstatus: any;
  fetchedCgst = 0;
  fetchedSgst = 0;
  fetchedIgst = 0;
  fetchedSubtotal = 0;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadProducts();
    this.loadTaxSettings();
  }

  loadTaxSettings() {
    this.settingsService.getSettings().subscribe(
      (data: any) => {
        this.taxstatus = data?.tax_status || false;
        if (data && data?.tax_status) {
          this.sgst = data.sgst ?? 0;
          this.cgst = data.cgst ?? 0;
          this.igst = data.igst ?? 0;
          this.taxAmount = this.sgst + this.cgst;
        }
      },
      (error) => {
        console.error('Settings error:', error);
      }
    );
  }

  initializeForm() {
    this.billForm = this.fb.group({
      billNumber: ['', Validators.required],
      paymentType: ['', Validators.required],
      discountType: ['amount'],
      discountValue: [0],
      cgst: [0],
      sgst: [0],
      igst: [0],
      tax_status: [false],
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.billForm.get('items') as FormArray;
  }

  createItemFormGroup(item: any = {}): FormGroup {
    const group = this.fb.group({
      id: [item.id || ''],
      productId: [item.id || '', Validators.required],
      productName: [{ value: item.productName || '', disabled: true }],
      quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [item.price || 0, Validators.required],
      totalPrice: [{ value: item.totalPrice || 0, disabled: true }],
      addons: this.fb.array(
        (item.addons || []).map((addon: any) =>
          this.fb.group({
            name: [addon.name],
            qty: [addon.qty],
            price: [addon.price],
            total: [{ value: addon.qty * addon.price, disabled: true }]
          })
        )
      )
    });

    // Recalculate totals whenever quantity or price changes
    group.get('quantity')?.valueChanges.subscribe(() => this.updateTotal());
    group.get('price')?.valueChanges.subscribe(() => this.updateTotal());

    // Recalculate totals whenever any addon changes
    (group.get('addons') as FormArray).controls.forEach((addon) => {
      addon.get('qty')?.valueChanges.subscribe(() => this.updateTotal());
      addon.get('price')?.valueChanges.subscribe(() => this.updateTotal());
    });

    return group;
  }

  getAddons(i: number): FormArray {
    return this.items.at(i).get('addons') as FormArray;
  }

  addAddon(i: number) {
    this.getAddons(i).push(
      this.fb.group({
        name: [''],
        qty: [1],
        price: [0],
        total: [{ value: 0, disabled: true }]
      })
    );
    this.updateTotal();
  }

  removeAddon(i: number, j: number) {
    this.getAddons(i).removeAt(j);
    this.updateTotal();
  }

  addItem() {
    this.items.push(this.createItemFormGroup());
    this.updateTotal();
  }

  removeItem(i: number) {
    this.items.removeAt(i);
    this.updateTotal();
  }

  loadProducts() {
    this.http.get('/product/product').subscribe(
      (res: any) => (this.products = res),
      (err) => console.error('Error fetching products', err)
    );
  }

  fetchBill() {
    const billNumber = this.billForm.get('billNumber')?.value;
    if (!billNumber) {
      this.snackBar.open('Enter Bill Number', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.http.get(`/order/${billNumber}`).subscribe(
      (res: any) => {
        const bill = res.bill;
        this.populateBill(bill);
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.snackBar.open('Bill not found', 'Close', { duration: 3000 });
      }
    );
  }

  populateBill(bill: any) {
    while (this.items.length) this.items.removeAt(0);
    bill.items.forEach((item: any) => this.items.push(this.createItemFormGroup(item)));

    this.billForm.patchValue({
      paymentType: bill.paymentType,
      discountType: bill.discountType || 'amount',
      discountValue: bill.discountValue || 0,
      cgst: bill.cgst || 0,
      sgst: bill.sgst || 0,
      igst: bill.igst || 0,
      tax_status: bill.tax_status || false
    });

    // Save the fetched tax percentages
    this.fetchedCgst = bill.cgst || 0;
    this.fetchedSgst = bill.sgst || 0;
    this.fetchedIgst = bill.igst || 0;

    // Save backend totals
    this.fetchedSubtotal = bill.totalAmount || 0;

    this.totalAmount = bill.totalAmount || 0;
    this.discountAmount = bill.discountAmount || 0;
    this.taxAmount = bill.taxAmount || 0;
    this.grandTotal = bill.grandTotal || 0;
  }



  updateProductName(i: number) {
    const productId = this.items.at(i).get('productId')?.value;
    const product = this.products.find(p => p._id === productId);
    if (product) {
      this.items.at(i).patchValue({ productName: product.name, price: product.price });
    }
    this.updateTotal();
  }

  updateTotal() {
    let subtotal = 0;

    // Calculate subtotal including addons
    this.items.controls.forEach((item, i) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      const addons = this.getAddons(i).getRawValue();
      const addonsTotal = addons.reduce((sum: number, a: any) => sum + a.qty * a.price, 0);

      const itemTotal = quantity * price + addonsTotal;
      item.patchValue({ totalPrice: itemTotal }, { emitEvent: false });

      subtotal += itemTotal;
    });

    this.totalAmount = subtotal;

    // Calculate discount
    const discountType = this.billForm.get('discountType')?.value;
    const discountValue = this.billForm.get('discountValue')?.value || 0;
    this.discountAmount = discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountValue;

    // Taxable amount
    const taxable = subtotal;

    // Calculate tax strictly using backend percentages
    const cgstAmount = (taxable * this.cgst) / 100;
    const sgstAmount = (taxable * this.sgst) / 100;
    const igstAmount = (taxable * this.igst) / 100;

    this.billForm.patchValue({ cgst: cgstAmount, sgst: sgstAmount, igst: igstAmount })

    this.taxAmount = cgstAmount + sgstAmount + igstAmount;

    // Grand total
    this.grandTotal = taxable + this.taxAmount;

    // Round values
    this.totalAmount = Math.round(this.totalAmount * 100) / 100;
    this.discountAmount = Math.round(this.discountAmount * 100) / 100;
    this.taxAmount = Math.round(this.taxAmount * 100) / 100;
    this.grandTotal = Math.round(this.grandTotal - this.discountAmount);
  }

  updateBill() {
    if (this.billForm.invalid) {
      this.snackBar.open('Please correct form errors', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.billForm.getRawValue();
    const payload = {
      billNumber: formValue.billNumber,
      paymentType: formValue.paymentType,
      discountType: formValue.discountType,
      discountValue: formValue.discountValue,
      cgst: formValue.cgst,
      sgst: formValue.sgst,
      igst: formValue.igst,
      tax_status: formValue.tax_status,
      items: formValue.items.map((item: any) => ({
        id: item.productId,
        quantity: item.quantity,
        price: item.price,
        addons: item.addons.map((a: any) => ({
          name: a.name,
          qty: a.qty,
          price: a.price
        }))
      }))
    };

    this.http.put(`/order/${payload.billNumber}/update`, payload).subscribe(
      () => this.snackBar.open('Bill updated successfully!', 'Close', { duration: 3000 }),
      (err) => this.snackBar.open(err.error.message || 'Update failed', 'Close', { duration: 3000 })
    );
  }
}
