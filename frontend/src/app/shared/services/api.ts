import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly apiUrl = 'http://localhost:5160/api';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }

  startGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}/games`, {}, { headers: this.headers() });
  }

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games`, { headers: this.headers() });
  }

  getGame(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/games/${gameId}`, { headers: this.headers() });
  }

  checkSet(gameId: number, cardIds: number[]): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/games/${gameId}/check-set`,
      { cardIds },
      { headers: this.headers() },
    );
  }

  abandonGame(gameId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/games/${gameId}/abandon`,
      {},
      { headers: this.headers() },
    );
  }

  getGameStatistics(gameId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/games/${gameId}/statistics`,
      { headers: this.headers() },
    );
  }

  getHint(gameId: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/games/${gameId}/hint`,
      { headers: this.headers() }
    );
  }
}