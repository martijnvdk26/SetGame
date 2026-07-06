import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game';

@Component({
  selector: 'app-game-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-actions.html',
  styleUrl: './game-actions.css',
})
export class GameActionsComponent {
  // Navigation-related actions bubble up to the container (callback pattern)
  @Output() newGame = new EventEmitter<void>();
  @Output() abandon = new EventEmitter<void>();

  // Pure state actions go straight through the shared service
  constructor(public gameService: GameService) {}
}
