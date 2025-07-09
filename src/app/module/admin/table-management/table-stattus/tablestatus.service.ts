import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class TableStatusService {

  constructor(private httpClient: HttpClient) { }

  getTableStatus() {
    return this.httpClient.get('/table/table-status')
  }

  completeOrder(orderId: string, paymentType: string) {
    return this.httpClient.put(`/order/${orderId}/complete`, { paymentType });
  }

}
