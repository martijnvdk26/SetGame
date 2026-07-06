import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { GameService } from '../services/game';
import { Api } from '../../shared/services/api';
import { CardComponent } from '../shared/card/card';
import { GameMetaComponent } from '../game-meta/game-meta';
import { StatusMessageComponent } from '../status-message/status-message';
import { GameActionsComponent } from '../game-actions/game-actions';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    GameMetaComponent,
    StatusMessageComponent,
    GameActionsComponent,
  ],
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
  ) { }

  ngOnInit(): void {
  this.route.params.subscribe((params) => {
    const gameId = params['gameId'];
    if (gameId) {
      this.gameService.loadExistingGame(parseInt(gameId)).subscribe({ error: () => {} });
    } else if (!this.gameService.game()) {
      this.newGame();
    }
  });
}

newGame(): void {
  this.gameService.startNewGame().subscribe({ error: () => {} });
}

  select(cardId: number): void {
    this.gameService.selectCard(cardId);
  }
  clearSelection(): void {
    this.gameService.clearSelection();
  }
  requestHint(): void {
    this.gameService.requestHint();
  }
  goHome(): void {
    this.gameService.reset();
    this.router.navigate(['/games']);
  }

  abandonGame(): void {
    const game = this.gameService.game();
    if (!game) return;
    this.api.abandonGame(game.id).subscribe({
      next: () => {
        this.gameService.reset();
        this.router.navigate(['/games']);
      },
      error: (err) => console.error('Fout bij stoppen van spel', err),
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  isSelected(cardId: number): boolean {
    return this.gameService.selectedIds().includes(cardId);
  }
  isHinted(cardId: number): boolean {
    return this.gameService.hintedIds().includes(cardId);
  }
}
