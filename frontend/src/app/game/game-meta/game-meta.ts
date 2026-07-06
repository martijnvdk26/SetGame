import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameService} from '../services/game';

@Component({
  selector: 'app-game-meta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-meta.html',
  styleUrl: './game-meta.css',
})
export class GameMetaComponent {
  constructor(public gameService: GameService){}
}
