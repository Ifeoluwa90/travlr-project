import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  public credentials = {
    email: '',
    password: ''
  };
  public errorMessage = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  public onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed';
      }
    });
  }
}
