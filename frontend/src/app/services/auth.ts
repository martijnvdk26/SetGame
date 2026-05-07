import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));
  private username = signal<string | null>(localStorage.getItem('username'));

  isLoggedIn = computed(() => !!this.token());
  currentUsername = computed(() => this.username());

  constructor(
    private api: Api,
    private router: Router
  ) {}

  register(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Verzoek getimedout')), 30000);

      this.api.register(username, password).subscribe({
        next: () => {
          clearTimeout(timeout);
          resolve();
        },
        error: (err) => {
          clearTimeout(timeout);
          reject(err);
        }
      });
    });
  }

  login(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Verzoek getimedout')), 30000);

      this.api.login(username, password).subscribe({
        next: (response: any) => {
          clearTimeout(timeout);
          const token = response.token ?? response.Token;

          if (!token) {
            reject(new Error('Geen token ontvangen'));
            return;
          }

          localStorage.setItem('token', token);
          localStorage.setItem('username', username);

          this.token.set(token);
          this.username.set(username);

          resolve();
        },
        error: (err) => {
          clearTimeout(timeout);
          reject(err);
        }
      });
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.token.set(null);
    this.username.set(null);

    this.router.navigate(['/login']);
  }
}
