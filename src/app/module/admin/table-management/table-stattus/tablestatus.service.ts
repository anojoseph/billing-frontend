import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class TableStatusService {

  constructor(private httpClient: HttpClient) { }

  getTableStatus() {
    return this.httpClient.get('/table/table-status')
  }

  completeOrder(orderId: string, payload: {
    paymentType: string;
    discountType?: 'percentage' | 'amount';
    discountValue?: number;
  }) {
    return this.httpClient.put(`/order/${orderId}/complete`, payload);
  }

}
