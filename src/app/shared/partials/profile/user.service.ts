import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private httpClient: HttpClient) { }


    updateUser(data: any) {
        return this.httpClient.patch('/api/auth/update-user', data); // Adjust API URL
    }

    getUserById(id: string) {
        return this.httpClient.get(`/api/auth/user/${id}`);
    }

    changePassword(data: any) {
        return this.httpClient.patch('/api/auth/change-password', data);
    }

}   