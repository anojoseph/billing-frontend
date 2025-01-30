import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class MealtypeService {

  constructor(private httpClient: HttpClient) { }

  getmealtypebyid(id: any) {
    return this.httpClient.get(`/product/meal-type/${id}`)
  }

  postmealtype(data: any) {
    return this.httpClient.post('/product/meal-type/', data)
  }

  patchmealtype(data: any) {
    return this.httpClient.patch(`/product/meal-type/${data.id}`, data)
  }

  delete(data:any){
    return this.httpClient.delete(`/product/meal-type/${data}`)
  }

}
