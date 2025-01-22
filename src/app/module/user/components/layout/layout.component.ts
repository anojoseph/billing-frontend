import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  showMenu: boolean = true; // Controls which component is visible
  isMobile: boolean = false; // Tracks whether it's mobile view or not

  constructor() {
    // Check if the screen width is below the mobile breakpoint
    console.log(window.innerWidth)
    this.isMobile = window.innerWidth <= 768;
    console.log(this.isMobile)
    console.log(this.isMobile)
    // Listen to window resize events to dynamically update the layout
    window.addEventListener('resize', this.onResize.bind(this));
  }

  toggleView() {
    this.showMenu = !this.showMenu; // Toggle visibility of components
    console.log(this.isMobile)
    console.log(this.isMobile)
  }

  // Update isMobile flag on window resize
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    console.log(this.isMobile)
    console.log(this.isMobile)
  }

}
