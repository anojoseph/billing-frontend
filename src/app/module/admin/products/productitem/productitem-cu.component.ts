import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductItemService } from './productitem.service';

@Component({
  selector: 'app-productitemcu',
  templateUrl: './productitem-cu.component.html'
})

export class ProductItemCuComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private producitemservice: ProductItemService
  ) {
    this.producItemForm = this.fb.group({
      id:[''],
      name: ['', Validators.required],
      status: [true, Validators.required],
    });
  }

  formaction: any = 'Save';
  actiontype: any = 'Add';

  producItemForm: FormGroup;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const productId = params['id'];
      console.log(productId)
      if (productId) {
        console.log("added in this if")
        this.formaction = 'Update';
        this.actiontype = 'Edit';
        this.producitemservice.getproductbyid(productId).subscribe((response: any) => {
          console.log(response)
          this.producItemForm.patchValue({
            id: response.id,
            name: response.name,
            status: response.status,
          });
        });
      }
    });
  }


  get f() {
    return this.producItemForm.controls
  }

  submit() {
    if (this.producItemForm.valid) {
      console.log(this.actiontype)
      if (this.actiontype == 'Add') {
        this.producitemservice.postproducitem(this.producItemForm.value).subscribe((response: any) => {
          console.log(response)
          this.toastr.success('Product Item Added Successfully');
          this.router.navigate(['admin/productitem']);
        },
          (error: any) => {
            this.toastr.error(error.error.message);
          });
      }
      else if (this.actiontype == 'Edit') {
        this.producitemservice.patchproductitem(this.producItemForm.value).subscribe((response: any) => {
          console.log(response);
          this.toastr.success('Product Item Updated Successfully');
          this.router.navigate(['admin/productitem']);
        },
          (error: any) => {
            this.toastr.error(error.error.message);
          });
      }
    }
    else {
      this.toastr.error('Please fill all the fields', 'Error');
    }
  }


}
