import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private userTypeKey = 'userType';

  constructor() { }

  // Store tokens and user type in localStorage (or another secure storage)
  login(accessToken: string, refreshToken: string, userType: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userTypeKey, userType);
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Get user type
  getUserType(): string | null {
    return localStorage.getItem(this.userTypeKey);
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    // Add logic to validate the token (e.g., checking expiration)
    return !!token;
  }

  // Logout and clear stored data
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userTypeKey);
  }
}
