import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../report.service';


@Component({
  selector: 'app-item-wisesales-report',
  templateUrl: './sales-report.component.html',
})
export class ItemWiseSalesReportComponent implements OnInit {
  filterForm: FormGroup;
  total: any;
  billdata: any;
  showtable: boolean = false;
  today = new Date();
  loading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private reportService: ReportService
  ) {
    this.filterForm = this.fb.group({
      startDate: [this.today],
      endDate: [this.today],
    });
  }

  ngOnInit(): void { }

  generateReport(): void {
    const startDate = this.filterForm.value.startDate?.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const endDate = this.filterForm.value.endDate?.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    this.showtable = false;

    if (!startDate || !endDate) {
      this.toastr.error('Please select both start and end dates.');
      return;
    }

    this.loading=true;
    this.reportService.geitemwisetreport(startDate, endDate).subscribe((response: any) => {
      console.log(response)
      this.billdata = response.items;
      this.total = response.summary;
      this.loading = false;
      this.showtable = true;

    },
      (error) => {
        this.showtable = false;
        this.loading = false;
        this.toastr.error(error.message || 'Error fetching report');
      }
    );
  }
}
