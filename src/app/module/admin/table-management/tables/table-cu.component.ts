import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductItemService } from '../../products/foodtype/productitem.service';
import { TableService } from './table.service';

@Component({
  selector: 'app-tablecu',
  templateUrl: './table-cu.component.html'
})

export class TableCuComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tableservice: TableService
  ) {
    this.tableForm = this.fb.group({
      id: [''],
      no: ['', Validators.required],
      name: [''],
      qr_code: [],
      status: [true, Validators.required],
    });
  }

  formaction: any = 'Save';
  actiontype: any = 'Add';
  tableForm: FormGroup;
  loading: boolean = false;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.formaction = 'Update';
        this.actiontype = 'Edit';
        this.tableservice.gettablebyid(productId).subscribe((response: any) => {
          this.tableForm.patchValue({
            id: response.id,
            name: response.name,
            status: response.status,
            no: response.no,
            qr_status: response.qr_status
          });
        });
      }
    });
  }


  get f() {
    return this.tableForm.controls
  }

  submit() {
    if (this.tableForm.valid) {
      if (this.actiontype == 'Add') {
        this.loading = true;
        this.tableservice.posttable(this.tableForm.value).subscribe((response: any) => {
          this.toastr.success('Table Added Successfully');
          this.router.navigate(['admin/table/table/']);
          this.loading = false;
        },
          (error: any) => {
            this.toastr.error(error.error.message);
            this.loading = false;
          });
      }
      else if (this.actiontype == 'Edit') {
        this.loading = true;
        this.tableservice.patchtable(this.tableForm.value).subscribe((response: any) => {
          this.toastr.success('Table Updated Successfully');
          this.router.navigate(['admin/table/table/']);
          this.loading = false;
        },
          (error: any) => {
            this.toastr.error(error.error.message);
            this.loading = false;
          });
      }
    }
    else {
      this.toastr.error('Please fill all the fields', 'Error');
    }
  }


}
