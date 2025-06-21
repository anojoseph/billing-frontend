import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class cartService {

  constructor(private httpClient: HttpClient) { }

  gettables() {
    return this.httpClient.get('/table/table')
  }

  createOrder(orderData: any): Observable<any> {
    return this.httpClient.post('/order/create', orderData);
  }

  printOrder(id: string) {
    return this.httpClient.post<{ printContent: string }>(`/order/${id}/print`, {});
  }




}
