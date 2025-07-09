import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class KitchenService {

  constructor(private httpClient: HttpClient) { }

  getkitchenbyid(id: any) {
    return this.httpClient.get(`/kitchens/kitchen/${id}`)
  }

  postkitchen(data: any) {
    return this.httpClient.post('/kitchens/kitchen/', data)
  }

  patchkitchen(data: any) {
    return this.httpClient.patch(`/kitchens/kitchen/${data.id}`, data)
  }

  delete(data: any) {
    return this.httpClient.delete(`/kitchens/kitchen/${data}`)
  }

  getproduct() {
    return this.httpClient.get('/product/product/')
  }

  getallkitchen() {
    return this.httpClient.get(`/kitchens/kitchen`)
  }
}
