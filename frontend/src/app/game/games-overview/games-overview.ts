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

  startNewGame(): void {
  this.gameService.startNewGame().subscribe({
    next: (game) => this.router.navigate(['/game-board', game.id]),
    error: () => this.error.set('Nieuw spel starten mislukt.'),
  });
}

continueGame(gameId: number): void {
  this.gameService.loadExistingGame(gameId).subscribe({
    next: (game) => this.router.navigate(['/game-board', game.id]),
    error: () => this.error.set('Dit spel kon niet worden geladen.'),
  });
}




  abandonGame(gameId: number): void {
    this.api.abandonGame(gameId).subscribe({
      next: () => {
        this.gameService.reset();
        this.loadGames();
      },
      error: (err) => {
        console.error('Fout bij stoppen van spel', err);
        this.error.set('Spel kon niet worden gestopt.');
      },
    });
  }

  viewStatistics(gameId: number): void {
    this.router.navigate(['/game', gameId, 'statistics']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
