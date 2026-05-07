import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Api } from './services/api';
import { GameService } from './services/game';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-games-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './games-overview.html',
  styleUrls: ['./games-overview.css'],
})
export class GamesOverviewComponent implements OnInit {
  games: any[] = [];

  constructor(
    private api: Api,
    private gameService: GameService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.getGames().subscribe({
      next: (games) => (this.games = games),
      error: (err) => console.error('Kon spellen niet ophalen', err),
    });
  }

  async startNewGame() {
    await this.gameService.startNewGame();
    this.router.navigate(['/game-board']);
  }

  logout(): void{
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  async continueGame(gameId: number) {
    try {
      // Dit laadt daadwerkelijk de state van het oude spel in!
      await this.gameService.loadExistingGame(gameId);
      this.router.navigate(['/game-board']);
    } catch (error) {
      console.error('Fout bij laden van spel', error);
    }
  }
}
