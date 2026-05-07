import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async login(): Promise<void> {
    this.error = '';
    this.loading = true;

    try {
      await this.auth.login(this.username, this.password);
      await this.router.navigate(['/game-board']);
    } catch {
      this.error = 'Login mislukt.';
    } finally {
      this.loading = false;
    }
  }

  async register(): Promise<void> {
    this.error = '';
    this.loading = true;

    try {
      await this.auth.register(this.username, this.password);
      await this.auth.login(this.username, this.password);
    } catch {
      this.error = 'Registratie mislukt.';
    } finally {
      this.loading = false;
    }
  }
}
