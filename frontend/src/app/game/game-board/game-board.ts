import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { GameService } from '../services/game';
import { Api } from '../../shared/services/api';
import { CardComponent } from '../shared/card/card';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css',
})
export class GameBoardComponent implements OnInit {
  constructor(
    public gameService: GameService,
    public auth: AuthService,
    private api: Api,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['gameId'];
      if (gameId) {
        this.gameService.loadExistingGame(parseInt(gameId)).catch(() => {});
      } else if (!this.gameService.game()) {
        this.newGame();
      }
    });
  }

  newGame(): void {
    this.gameService.startNewGame().catch(() => {});
  }

  select(cardId: number): void {
    this.gameService.selectCard(cardId);
  }

  clearSelection(): void {
    this.gameService.clearSelection();
  }

  // NIEUW: Hint opvragen
  requestHint(): void {
    this.gameService.requestHint();
  }

  goHome(): void {
    this.gameService.reset();
    this.router.navigate(['/games']);
  }

  async abandonGame(): Promise<void> {
    const game = this.gameService.game();
    if (game) {
      try {
        await this.api.abandonGame(game.id).toPromise();
        this.gameService.reset();
        this.router.navigate(['/games']);
      } catch (err) {
        console.error('Fout bij stoppen van spel', err);
      }
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isSelected(cardId: number): boolean {
    return this.gameService.selectedIds().includes(cardId);
  }

  // NIEUW: Check of kaart ge-hint wordt
  isHinted(cardId: number): boolean {
    return this.gameService.hintedIds().includes(cardId);
  }
}