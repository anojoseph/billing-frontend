import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './product.service';

@Component({
    selector: 'app-bulk-upload-dialog',
    templateUrl: './bulk-upload-dialog.component.html'
})
export class BulkUploadDialogComponent {
    excelFile: File | null = null;
    isUploading: boolean = false;

    constructor(
        private productService: ProductService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<BulkUploadDialogComponent>
    ) { }

    onExcelFileChange(event: any) {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            this.excelFile = file;
        } else {
            this.toastr.error("Please select a valid Excel file (.xlsx or .xls)");
        }
    }

    uploadExcel() {
        if (!this.excelFile) {
            this.toastr.warning("No file selected");
            return;
        }

        this.isUploading = true;

        const formData = new FormData();
        formData.append("file", this.excelFile);

        this.productService.uploadBulkExcel(formData).subscribe(
            (res: any) => {
                this.toastr.success(res.message || "Products uploaded successfully");
                this.dialogRef.close(true);
            },
            (err) => {
                this.toastr.error(err.error.message || "Error uploading file");
            }
        ).add(() => {
            this.isUploading = false; // Reset the loader state
        });
    }
}
