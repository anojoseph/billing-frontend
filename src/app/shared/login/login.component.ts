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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Validate email
      password: ['', Validators.required] // Example password validation
    });
  }

  ngOnInit() { }

  onSubmit(): void {
    const loginData = { username: this.loginForm.value.username, password: this.loginForm.value.password };

    // Replace with your backend's login API URL
    this.http.post<any>('auth_app/auth/login/', loginData).subscribe({
      next: (response) => {
        const { accessToken, refreshToken, userType } = response;

        // Store tokens and user type
        this.authService.login(accessToken, refreshToken, userType);

        // Redirect to the intended URL or default to the dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/menu';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.error = 'Invalid username or password'; // Customize error message
      },
    });
  }
}
