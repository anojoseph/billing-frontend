import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class ProductItemService {

  constructor(private httpClient: HttpClient) { }

  getproductbyid(id: any) {
    return this.httpClient.get(`/product/product-items/${id}`)
  }

  postproducitem(data: any) {
    return this.httpClient.post('/product/product-items/', data)
  }

  patchproductitem(data: any) {
    return this.httpClient.patch(`/product/product-items/${data.id}`, data)
  }

  delete(data:any){
    return this.httpClient.delete(`/product/product-items/${data}`)
  }

}
