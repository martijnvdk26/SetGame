import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CardViewModel {
  id: number;
  color: string;
  shape: string;
  number: string;
  shading: string;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class CardComponent {
  @Input({ required: true }) card!: CardViewModel;
  @Input() selected = false;
  @Input() hinted = false;
  @Output() cardSelected = new EventEmitter<number>();

  onClick(): void {
    this.cardSelected.emit(this.card.id);
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
