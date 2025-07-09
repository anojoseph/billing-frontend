import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../report.service';

@Component({
    selector: 'app-day-wise-report',
    templateUrl: './day-wise-report.component.html',
})
export class DayWiseReportComponent implements OnInit {
    filterForm: FormGroup;
    loading = false;
    reportData: any[] = [];
    showTable = false;
    today = new Date();

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
        const startDate = this.filterForm.value.startDate?.toISOString().split('T')[0];
        const endDate = this.filterForm.value.endDate?.toISOString().split('T')[0];

        if (!startDate || !endDate) {
            this.toastr.error('Please select both start and end dates.');
            return;
        }

        this.loading = true;
        this.showTable = false;

        this.reportService.getDaywisetreport(startDate, endDate).subscribe(
            (response: any) => {
                this.reportData = response.days;
                this.showTable = true;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
                this.toastr.error(error.message || 'Error fetching report');
            }
        );
    }
}
