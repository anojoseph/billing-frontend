// bill-update.component.ts
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bill-update',
  templateUrl: './bill-update.component.html',
  styleUrls: ['./bill-update.component.css']
})
export class BillUpdateComponent implements OnInit {
  billForm: FormGroup;
  products: any[] = [];
  bill: any = null;
  displayedColumns = ['productName', 'quantity', 'price', 'totalPrice', 'actions'];
  totalAmount: number = 0;
  isLoading: boolean = false;
  filteredProducts: any[][] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.billForm = this.fb.group({
      billNumber: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.fetchProducts();
    this.addItem();
  }

  get items(): FormArray {
    return this.billForm.get('items') as FormArray;
  }

  fetchProducts() {
    this.http.get('/product/product').subscribe(
      (response: any) => {
        this.products = response;

      },
      (error) => console.error('Error fetching products:', error)
    );
  }

  fetchBill() {
    const billNumber = this.billForm.get('billNumber')?.value;
    if (!billNumber) {
      this.snackBar.open('Please enter a bill number.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.http.get(`/order/${billNumber}`).subscribe(
      (response: any) => {
        this.bill = response.bill;
        this.populateBill(response.bill);
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Bill not found.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  populateBill(bill: any) {
    while (this.items.length) {
      this.items.removeAt(0);
    }

    if (bill.items && Array.isArray(bill.items) && bill.items.length > 0) {
      bill.items.forEach((item: any) => {
        const formGroup = this.createItemFormGroup({
          id: item.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice
        });
        this.items.push(formGroup);
        this.updateProductName(this.items.length - 1);
      });
    } else {
      this.addItem();
    }
    this.updateTotal();
  }

  createItemFormGroup(item: any = {}): FormGroup {
    return this.fb.group({
      id: [item.id || ''],
      productId: [item.productId || '', Validators.required],
      productName: [{ value: item.productName || '', disabled: true }],
      quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [item.price || 0, [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: item.totalPrice || 0, disabled: true }]
    });
  }

  updateProductName(index: number) {
    const productId = this.items.at(index).get('productId')?.value;
    const product = this.products.find(p => p._id === productId);
    if (product) {
      this.items.at(index).patchValue({
        id: product._id,
        productName: product.name,
        price: product.price || 0
      });
      this.updateTotal();
    }
  }

  addItem() {
    this.items.push(this.createItemFormGroup());
    this.updateTotal();
    this.filteredProducts.push([...this.products]); // Initialize filtered list
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.updateTotal();
  }

  filterProducts(index: number) {
    const searchValue = this.items.at(index).get('productSearch')?.value.toLowerCase();
    this.filteredProducts[index] = this.products.filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
  }

  selectProduct(product: any, index: number) {
    this.items.at(index).patchValue({
      productId: product._id,
      productSearch: product.name,
      price: product.price,
      totalPrice: product.price
    });
  }

  updateBill() {
    if (this.billForm.invalid) {
      this.snackBar.open('Please correct the errors in the form.', 'Close', { duration: 3000 });
      return;
    }

    const items = this.items.getRawValue().map(item => ({
      id: item.productId,  // Use productId as the id
      quantity: item.quantity,
      price: item.price
    }));

    const updatedBill = {
      billNumber: this.billForm.get('billNumber')?.value,
      items: items
    };

    this.http.put(`/order/${updatedBill.billNumber}/update`, updatedBill).subscribe(
      (response: any) => {
        this.snackBar.open('Bill updated successfully!', 'Close', { duration: 3000 });
        this.fetchBill();
      },
      (error) => {
        console.error('Error updating bill:', error);
        this.snackBar.open(error.error.message || 'Error updating bill', 'Close', { duration: 3000 });
      }
    );
  }

  updateTotal() {
    let total = 0;
    this.items.controls.forEach((item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      const totalPrice = quantity * price;

      item.patchValue({
        totalPrice: totalPrice
      }, { emitEvent: false });

      total += totalPrice;
    });
    this.totalAmount = total;
  }

  deletebill() {
    const billNumber = this.billForm.get('billNumber')?.value;

    if (!billNumber) {
      this.snackBar.open('Please enter a Bill Number to delete', 'Close', { duration: 3000 });
      return;
    }

    const confirmation = window.confirm(`Are you sure you want to delete bill ${billNumber}?`);

    if (confirmation) {
      this.http.delete(`/order/${billNumber}/delete`).subscribe(
        (response: any) => {
          this.snackBar.open('Bill deleted successfully!', 'Close', { duration: 3000 });
          this.billForm.reset();
          this.bill=null;
        },
        (error) => {
          console.error('Error deleting bill:', error);
          this.snackBar.open(error.error.message || 'Error deleting bill', 'Close', { duration: 3000 });
        }
      );
    }
  }

}
