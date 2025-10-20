import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../report.service';
import { MatDialog } from '@angular/material/dialog';
import { BillHistoryModalComponent } from './bill-history-modal.component';

@Component({
    selector: 'app-bill-edit-report',
    templateUrl: './bill-edit-report.component.html'
})
export class BillEditReportComponent implements OnInit {
    filterForm: FormGroup;
    historyData: any[] = [];
    showTable = false;
    loading = false;
    today = new Date();

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private reportService: ReportService,
        private dialog: MatDialog
    ) {
        this.filterForm = this.fb.group({
            startDate: [this.today],
            endDate: [this.today]
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
        this.reportService.getBillEditReport(startDate, endDate).subscribe(
            (response: any) => {
                this.historyData = response.history;
                this.loading = false;
                this.showTable = true;
            },
            (error) => {
                this.loading = false;
                this.toastr.error(error.message || 'Error fetching report');
            }
        );
    }

    viewHistory(billNumber: string) {
        this.reportService.getBillHistory(billNumber).subscribe(
            (response) => {
                this.dialog.open(BillHistoryModalComponent, {
                    width: '900px',
                    data: { billNumber: response.billNumber, history: response.history }
                });
            },
            (error) => {
                this.toastr.error(error.message || 'Error fetching history');
            }
        );
    }
}
