import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Api } from '../../shared/services/api';
import { GameService } from '../services/game';
import { AuthService } from '../../auth/services/auth';

export interface GameOverviewItem {
  id: number;
  status: string;
  startTime: string;
  endTime: string | null;
}

@Component({
  selector: 'app-games-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './games-overview.html',
  styleUrls: ['./games-overview.css'],
})
export class GamesOverviewComponent implements OnInit {
  games = signal<GameOverviewItem[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    private api: Api,
    private gameService: GameService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading.set(true);
    this.error.set('');

    this.api
      .getGames()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const list = Array.isArray(response) ? response : [];
          this.games.set(list);
          console.log('GET /api/games response:', response);
          console.log('games.length:', list.length);
        },
        error: (err) => {
          console.error('Kon spellen niet ophalen', err);
          this.error.set('Spellen konden niet worden geladen.');
          this.games.set([]);
        },
      });
  }

  async startNewGame(): Promise<void> {
    try {
      const gameId = await this.gameService.startNewGame();
      await this.router.navigate(['/game-board', gameId]);
    } catch (err) {
      console.error('Nieuw spel starten mislukt', err);
      this.error.set('Nieuw spel starten mislukt.');
    }
  }

  async continueGame(gameId: number): Promise<void> {
    try {
      await this.gameService.loadExistingGame(gameId);
      await this.router.navigate(['/game-board', gameId]);
    } catch (err) {
      console.error('Fout bij laden van spel', err);
      this.error.set('Dit spel kon niet worden geladen.');
    }
  }

  async abandonGame(gameId: number): Promise<void> {
    try {
      await this.api.abandonGame(gameId).toPromise();
      this.gameService.reset();
      this.loadGames();
    } catch (err) {
      console.error('Fout bij stoppen van spel', err);
      this.error.set('Spel kon niet worden gestopt.');
    }
  }

  viewStatistics(gameId: number): void {
    this.router.navigate(['/game', gameId, 'statistics']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
