import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    // Prepend the base URL
    const apiUrl = environment.baseUrl + req.url;

    // Clone the request with the new URL and Authorization header (if token exists)
    const clonedReq = req.clone({
      url: apiUrl,
      setHeaders: accessToken
        ? {
          Authorization: `Bearer ${accessToken}`,
        }
        : {},
    });

    return next.handle(clonedReq);
  }
}
