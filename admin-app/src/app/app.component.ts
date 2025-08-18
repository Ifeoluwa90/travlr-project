import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false  // REQUIRED for NgModule
})
export class AppComponent {
  title = 'Travlr Getaways - Admin Panel';
}