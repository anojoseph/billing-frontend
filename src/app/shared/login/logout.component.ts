import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  template:``
})

export class LogoutComponent implements OnInit {
  constructor(private authservice:AuthService) { }

  ngOnInit() {
    this.authservice.logout();
  }
}
