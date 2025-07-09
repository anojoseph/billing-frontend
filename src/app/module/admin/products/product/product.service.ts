import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getproductbyid(id: any) {
    return this.httpClient.get(`/product/product/${id}`)
  }

  postproduct(data: any) {
    return this.httpClient.post('/product/product/', data)
  }

  patchproduct(data: any) {
    return this.httpClient.patch(`/product/product/${data.id}`, data)
  }

  delete(data: any) {
    return this.httpClient.delete(`/product/product/${data}`)
  }

  getmealtypebyid() {
    return this.httpClient.get(`/product/meal-type/`)
  }

  getfoodtype() {
    return this.httpClient.get(`/product/product-items/`)
  }

  uploadBulkExcel(formData: FormData) {
    return this.httpClient.post('/product/bulk-upload', formData); // Adjust API URL if needed
  }

  getallkitchen() {
    return this.httpClient.get(`/kitchens/kitchen`)
  }



}
