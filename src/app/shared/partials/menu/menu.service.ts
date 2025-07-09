// services/menu.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from './menu.config';

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(private http: HttpClient) { }

    getMenu(role: string): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(`/menu/menu?role=${role}`);
    }

    // services/menu.service.ts
    createMenu(menu: any): Observable<any> {
        return this.http.post(`/menu/menu`, menu);
    }

    updateMenu(id: string, menu: any): Observable<any> {
        return this.http.put(`/menu/menu/${id}`, menu);
    }

    // services/menu.service.ts
    getMenuById(id: string): Observable<any> {
        return this.http.get(`/menu/menu/${id}`);
    }

    getallmenu() {
        return this.http.get('/menu/menu/all')
    }

    deleteMenu(menuId: string) {
        return this.http.delete(`/menu/menu/${menuId}`);
    }


}
