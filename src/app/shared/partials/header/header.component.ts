import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  onCloseSidenav() {
    // Additional logic can go here
    console.log('Sidenav closed');
  }
}
