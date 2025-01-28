import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private router:Router
  ) { }

  // Login and store the tokens and user details
  login(accessToken: string, refreshToken: string, userType: string, userDetails: any): void {
    localStorage.setItem('accessTokenKey', accessToken);
    localStorage.setItem('refreshTokenKey', refreshToken);
    localStorage.setItem('userTypeKey', userType);
    localStorage.setItem('userDetailsKey', JSON.stringify(userDetails)); // Store user details as a string
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessTokenKey');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshTokenKey');
  }

  // Get user type
  getUserType(): string | null {
    return localStorage.getItem('userTypeKey');
  }

  // Get user details
  getUserDetails(): any | null {
    const userDetails = localStorage.getItem('userDetailsKey');
    return userDetails ? JSON.parse(userDetails) : null; // Parse back the user details
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('accessTokenKey');
    localStorage.removeItem('refreshTokenKey');
    localStorage.removeItem('userTypeKey');
    localStorage.removeItem('userDetailsKey');
    this.router.navigate(['/login'])
  }
}
