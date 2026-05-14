import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '../../../shared/services/api';
import { AuthService } from '../../../auth/services/auth';
import { GameStatisticsResponse } from '../../services/game';
import { CardComponent } from '../../shared/card/card';

@Component({
  selector: 'app-game-statistics',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './game-statistics.html',
  styleUrl: './game-statistics.css',
})
export class GameStatisticsComponent implements OnInit {
  statistics = signal<GameStatisticsResponse | null>(null);
  loading = signal(false);
  error = signal('');

  constructor(
    private api: Api,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['gameId'];
      if (gameId) {
        this.loadStatistics(parseInt(gameId));
      }
    });
  }

  loadStatistics(gameId: number): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getGameStatistics(gameId).subscribe({
      next: (response) => {
        this.statistics.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Statistieken konden niet worden geladen.');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/games']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
