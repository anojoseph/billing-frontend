import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MealtypeService } from './mealtype.service';

@Component({
  selector: 'app-mealtypecu',
  templateUrl: './mealtype-cu.component.html'
})

export class MealTypeCuComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private producitemservice: MealtypeService
  ) {
    this.mealTypeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      status: [true, Validators.required],
    });
  }

  formaction: any = 'Save';
  actiontype: any = 'Add';

  mealTypeForm: FormGroup;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const editid = params['id'];
      if (editid) {
        this.formaction = 'Update';
        this.actiontype = 'Edit';
        this.producitemservice.getmealtypebyid(editid).subscribe((response: any) => {
          this.mealTypeForm.patchValue({
            id: response.id,
            name: response.name,
            status: response.status,
          });
        });
      }
    });
  }


  get f() {
    return this.mealTypeForm.controls
  }

  submit() {
    if (this.mealTypeForm.valid) {
      if (this.actiontype == 'Add') {
        this.producitemservice.postmealtype(this.mealTypeForm.value).subscribe((response: any) => {
          this.toastr.success('Meal Type Added Successfully');
          this.router.navigate(['admin/product/mealtype']);
        },
          (error: any) => {
            this.toastr.error(error.error.message);
          });
      }
      else if (this.actiontype == 'Edit') {
        this.producitemservice.patchmealtype(this.mealTypeForm.value).subscribe((response: any) => {
          this.toastr.success('Meal TypeItem Updated Successfully');
          this.router.navigate(['admin/product/mealtype']);
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
