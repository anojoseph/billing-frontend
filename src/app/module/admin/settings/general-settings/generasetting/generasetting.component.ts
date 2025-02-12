import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from './generasettings.service';

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

  constructor(private fb: FormBuilder, private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsForm = this.fb.group({
      storeName: [''],
      logo: [null],
      status: [true],
      stockUpdate: [false],
    });

    this.loadSettings();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe(
      (data: any) => {
        if (data) {
          this.settingsForm.patchValue({
            storeName: data.storeName || '',
            status: data.status ?? true,
            stockUpdate: data.stockUpdate ?? false,
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

      if (this.selectedFile) {
        formData.append('logo', this.selectedFile);
      }

      this.settingsService.updateSettings(formData).subscribe(() => {
        alert('Settings updated successfully!');
        this.isLoading = false; // Hide loader
        this.loadSettings();
      });
    }
  }
}
