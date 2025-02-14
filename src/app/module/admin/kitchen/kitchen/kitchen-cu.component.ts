import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { KitchenService } from './kitchen.service';

@Component({
  selector: 'app-kitchencu',
  templateUrl: './kitchen-cu.component.html'
})
export class KitchenCuComponent implements OnInit {
  kitchenForm: FormGroup;
  formaction: string = 'Save';
  actiontype: string = 'Add';
  loading: boolean = false;
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProducts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private kitchenservice: KitchenService
  ) {
    this.kitchenForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      status: [true, Validators.required],
      items: [[]],
      searchControl: ['']
    });
  }
  ngOnInit() {
    this.getProducts();

    this.kitchenForm.get('searchControl')?.valueChanges.subscribe((value: any) => {
      this.filterProducts(value);
    });

    this.activatedRoute.params.subscribe(params => {
      const kitchenId = params['id'];
      if (kitchenId) {
        this.actiontype = 'Edit';
        this.formaction = 'Update';
        this.kitchenservice.getkitchenbyid(kitchenId).subscribe((data: any) => {
          if (data) {
            this.kitchenForm.patchValue({
              id: data._id,
              name: data.name,
              status: data.status,
              items: data.items,
            });
            this.kitchenservice.getproduct().subscribe((products: any) => {
              this.products = products;
              this.filteredProducts = [...this.products];

              this.selectedProducts = this.products.filter(p => data.items?.some((item: any) => item._id === p._id));
              this.kitchenForm.patchValue({
                items: this.selectedProducts.map(p => p._id)
              });
            });
          }
        },
          (error) => {
            this.toastr.error(error.error.message || 'Error fetching kitchen details');
          });
      }
    });
  }


  getProducts() {
    this.kitchenservice.getproduct().subscribe(
      (response: any) => {
        this.products = response;
        this.filteredProducts = [...this.products];
      },
      (error) => {
        this.toastr.error(error.error.message || 'Error fetching the products');
      }
    );
  }

  filterProducts(query: any) {
    const val = typeof query === 'string' ? query.toLowerCase() : '';
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(val) &&
      !this.selectedProducts.some(p => p._id === product._id)
    );
  }

  addProduct(product: any) {
    if (!this.selectedProducts.some(p => p._id === product._id)) {
      this.selectedProducts.push(product);
      this.kitchenForm.patchValue({
        items: this.selectedProducts.map(p => p._id),
        searchControl: ''
      });
      this.filterProducts('');
    }
  }

  removeProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(p => p._id !== product._id);
    this.kitchenForm.patchValue({
      items: this.selectedProducts.map(p => p._id),
    });
    this.filterProducts(this.kitchenForm.get('searchControl')?.value);
  }

  submit() {
    if (this.kitchenForm.valid) {
      this.loading = true;
      const request$ = this.actiontype === 'Add'
        ? this.kitchenservice.postkitchen(this.kitchenForm.value)
        : this.kitchenservice.patchkitchen(this.kitchenForm.value);

      request$.subscribe(
        () => {
          this.toastr.success(`Kitchen ${this.actiontype === 'Add' ? 'Added' : 'Updated'} Successfully`);
          this.router.navigate(['admin/kitchen/kitchen/']);
          this.loading = false;
        },
        (error: any) => {
          this.toastr.error(error.error.message);
          this.loading = false;
        }
      );
    } else {
      this.toastr.error('Please fill all the fields', 'Error');
    }
  }
}
