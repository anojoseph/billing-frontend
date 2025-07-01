import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  userId: string = localStorage.getItem('user_id') || '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.userService.getUserById(this.userId).subscribe(
      (user: any) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role
        });
      },
      () => this.toastr.error('Failed to load user')
    );
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    const formData = { id: this.userId, ...this.profileForm.value };

    this.userService.updateUser(formData).subscribe(
      () => this.toastr.success('Profile updated successfully'),
      err => this.toastr.error(err.error.message || 'Failed to update profile')
    );
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.toastr.error('Please enter current and new password correctly');
      return;
    }

    const formData = { id: this.userId, ...this.passwordForm.value };

    this.userService.changePassword(formData).subscribe(
      () => {
        this.toastr.success('Password changed successfully');
        this.passwordForm.reset();
      },
      err => this.toastr.error(err.error.message || 'Failed to change password')
    );
  }
}
