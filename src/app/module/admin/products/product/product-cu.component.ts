import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product-cu.component.html'
})
export class ProductCuComponent implements OnInit {
  productForm: FormGroup;
  foodtypes: any[] = [];
  mealtypes: any[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  formAction: string = 'Save';
  actionType: string = 'Add';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      status: [true, Validators.required],
      price: ['', Validators.required],
      ingredients: [[]],
      type: ['', Validators.required],
      mealType: ['', Validators.required],
      qty: [''],
      selectedQty: [''],
      image: ['']
    });
  }

  ngOnInit() {
    this.loadFoodTypes();
    this.loadMealTypes();
    this.checkEditMode();
  }

  private initForm() { }

  private checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      const editId = params['id'];
      if (editId) {
        this.formAction = 'Update';
        this.actionType = 'Edit';
        this.productService.getproductbyid(editId).subscribe(
          (response: any) => {
            this.productForm.patchValue({
              id: response._id,
              name: response.name,
              status: response.status,
              price: response.price,
              ingredients: response.ingredients || [],
              type: response.type,
              mealType: response.mealType,
              qty: response.qty,
              selectedQty: response.selectedQty
            });
            this.imagePreview = response.image;
          },
          () => this.toastr.error('Error fetching product details')
        );
      }
    });
  }

  get f() {
    return this.productForm.controls;
  }

  private loadFoodTypes() {
    this.productService.getfoodtype().subscribe(
      (resp: any) => {
        this.foodtypes = resp;
      },
      error => this.toastr.error(error.message || 'Error fetching food types')
    );
  }

  private loadMealTypes() {
    this.productService.getmealtypebyid().subscribe(
      (resp: any) => this.mealtypes = resp,
      error => this.toastr.error(error.message || 'Error fetching meal types')
    );
  }

  onImageChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      // Validate File Type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.toastr.error('Invalid file type. Please upload a JPG or PNG image.');
        return;
      }

      // Validate File Size (max 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('File size exceeds 2MB. Please upload a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;  // This will set the preview as Base64 URL
      };
      reader.readAsDataURL(file);

      this.productForm.patchValue({ image: file });
    }
  }


  submit() {
    if (this.productForm.invalid) {
      this.toastr.error('Please fill all the required fields', 'Error');
      return;
    }

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      const value = this.productForm.value[key];

      if (key === 'type' && value) {
        const selectedType = this.foodtypes.find(ft => ft._id === value);
        formData.append(key, selectedType ? selectedType._id : '');
      } else if (key === 'mealType' && value) {
        const selectedMealType = this.mealtypes.find(mt => mt._id === value);
        formData.append(key, selectedMealType ? selectedMealType._id : '');
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (this.actionType === 'Add') {
      this.productService.postproduct(formData).subscribe(
        () => {
          this.toastr.success('Product Added Successfully');
          this.router.navigateByUrl('/admin/product/product');
        },
        error => this.toastr.error(error.error.message)
      );
    } else if (this.actionType === 'Edit') {
      this.productService.patchproduct(formData).subscribe(
        () => {
          this.toastr.success('Product Updated Successfully');
          this.router.navigateByUrl('/admin/product/product');
        },
        error => this.toastr.error(error.error.message)
      );
    }
  }
}
