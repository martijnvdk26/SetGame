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
  styleUrl: './game-board.css',
})
export class GameBoardComponent implements OnInit {
  constructor(
    public gameService: GameService,
    public auth: AuthService,
    private router: Router,
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

  goHome(): void {
    this.gameService.reset();
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
      Purple: '#7b1fa2',
    };
    return map[color] ?? '#222';
  }

  shapeHref(shape: string): string {
    const map: Record<string, string> = {
      Diamond: '#card_Diamond',
      Oval: '#card_Pill',
      Squiggle: '#card_Wave',
    };
    return map[shape] ?? '#card_Diamond';
  }

  shadingClass(shading: string): string {
    const normalized = (shading ?? '').toLowerCase();
    const map: Record<string, string> = {
      empty: 'outline',
      open: 'outline',
      halffull: 'striped',
      striped: 'striped',
      full: 'solid',
      solid: 'solid',
    };
    return map[normalized] ?? 'solid';
  }

  patternId(color: string): string {
    const map: Record<string, string> = {
      Red: 'stripes-red',
      Green: 'stripes-green',
      Purple: 'stripes-purple',
    };
    return map[color] ?? 'stripes-red';
  }

  isSelected(cardId: number): boolean {
    return this.gameService.selectedIds().includes(cardId);
  }

  getShapeCount(number: string): number {
    const value = (number ?? '').toLowerCase();
    if (value === 'one' || value === '1') return 1;
    if (value === 'two' || value === '2') return 2;
    if (value === 'three' || value === '3') return 3;
    return 1;
  }

  getShapeYPositions(number: string): number[] {
    const count = this.getShapeCount(number);
    if (count === 1) return [60];
    if (count === 2) return [38, 82];
    return [24, 60, 96];
  }
}
