import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from './generasettings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generasetting',
  templateUrl: './generasetting.component.html',
  styleUrls: ['./generasetting.component.css'],
})
export class GenerasettingComponent implements OnInit {
  settingsForm!: FormGroup;
  selectedFile: any;
  logoUrl: string | null = null;
  isLoading = false; // Loader flag
  availablePorts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastrservice: ToastrService) { }

  ngOnInit() {
    this.settingsForm = this.fb.group({
      storeName: [''],
      logo: [null],
      status: [true],
      stockUpdate: [false],
      printerPort: [''],
      accept_qr_booking: [''],
      show_available_qty: [false],
      auto_print_bill: [false],
      auto_print_kot: [false],
      auto_print_token: [false],
      tax_status: [false],
      sgst: [''],
      cgst: [''],
      igst: [''],
      storeAddress: [''],
      storeContact: [''],
      gstNumber: [''],
      gst_available: [false],
      fssai_available: [false],
      fssai_number: [''],
      whatsapp: ['']
    });

    this.loadSettings();
    //this.getserialport();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe(
      (data: any) => {
        if (data) {
          this.settingsForm.patchValue({
            storeName: data.storeName || '',
            status: data.status ?? true,
            stockUpdate: data.stockUpdate ?? false,
            printerPort: data.printerPort ?? '',
            accept_qr_booking: data?.accept_qr_booking,
            show_available_qty: data?.show_available_qty,
            auto_print_bill: data?.auto_print_bill,
            auto_print_kot: data?.auto_print_kot,
            auto_print_token: data?.auto_print_token,
            tax_status: data?.tax_status,
            sgst: data?.sgst,
            cgst: data?.cgst,
            igst: data?.igst,
            storeAddress: data.storeAddress ?? '',
            storeContact: data.storeContact ?? '',
            gstNumber: data.gstNumber ?? '',
            gst_available: data.gst_available ?? false,
            fssai_available: data.fssai_available ?? false,
            fssai_number: data.fssai_number ?? '',
            whatsapp: data.whatsapp ?? ''
          });

          this.logoUrl = data.logo ? data.logo : null;
        }
      },
      (error) => {
        console.error('Error fetching settings:', error);
      }
    );
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);

      this.settingsForm.patchValue({ logo: this.selectedFile });
    }
  }

  removeImage() {
    this.logoUrl = null;
    this.selectedFile = null;
    this.settingsForm.patchValue({ logo: null });
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      this.isLoading = true; // Show loader

      const formData = new FormData();
      formData.append('storeName', this.settingsForm.get('storeName')?.value);
      formData.append('status', this.settingsForm.get('status')?.value);
      formData.append('stockUpdate', this.settingsForm.get('stockUpdate')?.value);
      formData.append('printerPort', this.settingsForm.get('printerPort')?.value);
      formData.append('accept_qr_booking', this.settingsForm.get('accept_qr_booking')?.value);
      formData.append('show_available_qty', this.settingsForm.get('show_available_qty')?.value);
      formData.append('auto_print_bill', this.settingsForm.get('auto_print_bill')?.value);
      formData.append('auto_print_kot', this.settingsForm.get('auto_print_kot')?.value);
      formData.append('auto_print_token', this.settingsForm.get('auto_print_token')?.value);
      formData.append('tax_status', this.settingsForm.get('tax_status')?.value);
      formData.append('cgst', this.settingsForm.get('cgst')?.value);
      formData.append('sgst', this.settingsForm.get('sgst')?.value);
      formData.append('igst', this.settingsForm.get('igst')?.value);
      formData.append('storeAddress', this.settingsForm.get('storeAddress')?.value);
      formData.append('storeContact', this.settingsForm.get('storeContact')?.value);
      formData.append('gstNumber', this.settingsForm.get('gstNumber')?.value);
      formData.append('gst_available', this.settingsForm.get('gst_available')?.value);
      formData.append('fssai_available', this.settingsForm.get('fssai_available')?.value);
      formData.append('fssai_number', this.settingsForm.get('fssai_number')?.value);
      formData.append('whatsapp', this.settingsForm.get('whatsapp')?.value);

      if (this.selectedFile) {
        formData.append('logo', this.selectedFile);
      }

      this.settingsService.updateSettings(formData).subscribe(() => {
        this.isLoading = false; // Hide loader
        this.loadSettings();
        this.toastrservice.success("Updated successfully...!")
      });
    }
  }

  getserialport() {
    this.settingsService.getport().subscribe((ports: any) => {
      this.availablePorts = ports;
    }, (error) => {
      console.error(error);
    });
  }
}
