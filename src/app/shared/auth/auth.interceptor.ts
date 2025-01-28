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

    // Only prepend base URL if the request URL is relative
    const apiUrl = req.url.startsWith('http') ? req.url : environment.baseUrl + req.url;

    // Clone the request with necessary modifications
    const clonedReq = req.clone({
      url: apiUrl,
      setHeaders: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        'Content-Type': 'application/json',
      },
    });

    return next.handle(clonedReq);
  }
}
