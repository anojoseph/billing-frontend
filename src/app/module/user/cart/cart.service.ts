import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class cartService {

  constructor(private httpClient: HttpClient) { }

  gettables(){
    return this.httpClient.get('/table/table')
  }

}
