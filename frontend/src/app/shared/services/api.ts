import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly apiUrl = 'http://localhost:5160/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }
  startGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}/games`, {});
  }
  getGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games`);
  }
  getGame(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/games/${gameId}`);
  }
  checkSet(gameId: number, cardIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/games/${gameId}/check-set`, { cardIds });
  }
  abandonGame(gameId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/games/${gameId}/abandon`, {});
  }
  getGameStatistics(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/games/${gameId}/statistics`);
  }
  getHint(gameId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/games/${gameId}/hint`);
  }
}
