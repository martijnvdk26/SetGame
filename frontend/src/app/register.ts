import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // RouterModule is nodig voor de linkjes
  templateUrl: './register.html',
  styleUrl: './register.css', // Verwijst naar de eigen CSS
})
export class RegisterComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async register(): Promise<void> {
    this.error = '';
    this.loading = true;

    try {
      await this.auth.register(this.username, this.password);
      await this.auth.login(this.username, this.password); // Meteen inloggen
      await this.router.navigate(['/games']); // Doorsturen naar het bord!
    } catch {
      this.error = 'Registratie mislukt. Mogelijk bestaat deze gebruiker al.';
    } finally {
      this.loading = false;
    }
  }
}
