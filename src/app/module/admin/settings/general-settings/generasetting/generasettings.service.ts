import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getSettings() {
    return this.http.get('/settings/general-settings');
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.patch('/settings/general-settings', settings);
  }
}
