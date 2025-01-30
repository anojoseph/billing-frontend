import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string | null = null;
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() { }

  onSubmit(): void {
    const loginData = { email: this.loginForm.value.email, password: this.loginForm.value.password };
    this.loading = true;
    this.http.post<any>('/api/auth/login/', loginData).subscribe({
      next: (response) => {
        const accessToken = response.access_token;
        const refreshToken = response.refresh_token;
        const userType = response.user_type;
        const userDetails = response.user_details;
        this.authService.login(accessToken, refreshToken, userType, userDetails);
        const returnUrl = '';
        this.router.navigate([returnUrl]);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid username or password';
      },
    });
  }

}
