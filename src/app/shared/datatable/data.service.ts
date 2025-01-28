import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) { }

  getItems(
    url: string,
    searchValue: string = '',
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if ( searchValue) {
      params = params.set('searchValue', searchValue);
    }

    return this.http.get<any>(`/data-table/collection/${url}`, { params });
  }

  delete(id:any){
    return this.http.delete(`${id}`);
  }
}
