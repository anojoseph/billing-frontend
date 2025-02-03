import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class FoodMenuService {

  constructor(private httpClient: HttpClient) { }

  getfoodmenu(filters: any = {}): Observable<any> {
    return this.httpClient.get('/product/product/search', { params: filters });
  }

  getmealtype() {
    return this.httpClient.get('/product/meal-type')
  }

  getfoodtype() {
    return this.httpClient.get('/product/product-items')
  }

  searchProduct(query: string): Observable<any> {
    return this.httpClient.get(`/product/search-product?query=${query}`);
  }

}
