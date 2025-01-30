import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class TableService {

  constructor(private httpClient: HttpClient) { }

  gettablebyid(id: any) {
    return this.httpClient.get(`/table/table/${id}`)
  }

  posttable(data: any) {
    return this.httpClient.post('/table/table/', data)
  }

  patchtable(data: any) {
    return this.httpClient.patch(`/table/table/${data.id}`, data)
  }

  delete(data:any){
    return this.httpClient.delete(`/table/table/${data}`)
  }

}
