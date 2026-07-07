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
  
  @Output() newGame = new EventEmitter<void>();
  @Output() abandon = new EventEmitter<void>();

 constructor(public gameService: GameService) {}
}
