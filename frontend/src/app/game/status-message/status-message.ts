import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-message.html',
  styleUrl: './status-message.css',
})
export class StatusMessageComponent {
  constructor(public gameService: GameService){}

}
