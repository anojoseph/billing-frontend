import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessTokenKey = 'accessTokenKey';
  private refreshTokenKey = 'refreshTokenKey';
  private userTypeKey = 'userTypeKey';
  private userDetailsKey = 'userDetailsKey';

  constructor(private http: HttpClient, private router: Router) { }

  login(accessToken: string, refreshToken: string, userType: string, userDetails: any): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userTypeKey, userType);
    localStorage.setItem(this.userDetailsKey, JSON.stringify(userDetails));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ access_token: string }>(`${environment.baseUrl}/api/auth/refresh-token`, {
      refresh_token: this.getRefreshToken(),
    }).pipe(
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.access_token);
      }),
      // Extract only the access token to return as Observable<string>
      switchMap(response => {
        return new Observable<string>(observer => {
          observer.next(response.access_token);
          observer.complete();
        });
      })
    );
  }


  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userTypeKey);
    localStorage.removeItem(this.userDetailsKey);
    this.router.navigate(['/login']);
  }

  getUserType(): string | null {
    return localStorage.getItem(this.userTypeKey);
  }

}
