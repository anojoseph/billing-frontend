import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private httpClient: HttpClient) { }


  getreport(startDate: string, endDate: string) {
    return this.httpClient.get(`/reports/daily-report?startDate=${startDate}&endDate=${endDate}`);
  }

  
  geitemwisetreport(startDate: string, endDate: string) {
    return this.httpClient.get(`/reports/item-report?startDate=${startDate}&endDate=${endDate}`);
  }

  getDaywisetreport(startDate: string, endDate: string) {
    return this.httpClient.get(`/reports/day-report?startDate=${startDate}&endDate=${endDate}`);
  }
}
