import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class FoodMenuService {

  constructor(private httpClient: HttpClient) { }

  getfoodmenu(){
    return this.httpClient.get('/product/product')
  }

}
