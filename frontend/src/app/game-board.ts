import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { GameService } from './services/game';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css'
})
export class GameBoardComponent implements OnInit {
  constructor(
    public gameService: GameService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.gameService.game()) {
      this.newGame();
    }
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

  goHome() {
    this.router.navigate(['/games']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  colorMap(color: string): string {
    const map: Record<string, string> = {
      Red: '#d32f2f',
      Green: '#2e7d32',
      Purple: '#7b1fa2'
    };

    return map[color] ?? '#222';
  }
}
