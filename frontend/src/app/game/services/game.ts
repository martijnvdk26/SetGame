import { Injectable, computed, signal } from '@angular/core';
import { Api } from '../../shared/services/api';

export interface CardResponse {
  id: number;
  color: string;
  number: string;
  shading: string;
  shape: string;
  isInPlay: boolean;
  isMatched: boolean;
}

export interface GameResponse {
  id: number;
  status: string;
  cards: CardResponse[];
  cardsRemainingInDeck: number;
  startTime: string;
  endTime: string | null;
  setsFound: number;
}

export interface FoundSetDto {
  setId: number;
  foundAt: string;
  cards: CardResponse[];
}

export interface GameStatisticsResponse {
  gameId: number;
  status: string;
  setsFound: number;
  startTime: string;
  endTime: string | null;
  foundSets: FoundSetDto[];
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentGame = signal<GameResponse | null>(null);
  private selectedCardIds = signal<number[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  private message = signal<string | null>(null);

  game = computed(() => this.currentGame());
  selectedIds = computed(() => this.selectedCardIds());
  isLoading = computed(() => this.loading());
  errorMessage = computed(() => this.error());
  infoMessage = computed(() => this.message());

  constructor(private api: Api) {
    this.restoreGameFromStorage();
  }

  private restoreGameFromStorage(): void {
    const storedGame = localStorage.getItem('currentGame');
    if (storedGame) {
      try {
        const gameData = JSON.parse(storedGame);
        this.currentGame.set(gameData);
      } catch (e) {
        console.error('Failed to restore game from storage', e);
        localStorage.removeItem('currentGame');
      }
    }
  }

  private saveGameToStorage(): void {
    const game = this.currentGame();
    if (game) {
      localStorage.setItem('currentGame', JSON.stringify(game));
    }
  }

  startNewGame(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.loading.set(true);
      this.error.set(null);
      this.message.set(null);

      this.api.startGame().subscribe({
        next: (response: GameResponse) => {
          this.currentGame.set(response);
          this.saveGameToStorage();
          this.selectedCardIds.set([]);
          this.loading.set(false);
          resolve(response.id);
        },
        error: () => {
          this.error.set('Kon geen nieuw spel starten.');
          this.loading.set(false);
          reject();
        },
      });
    });
  }

  loadExistingGame(gameId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.loading.set(true);
      this.error.set(null);
      this.message.set(null);

      this.api.getGame(gameId).subscribe({
        next: (response: GameResponse) => {
          this.currentGame.set(response);
          this.saveGameToStorage();
          this.selectedCardIds.set([]);
          this.loading.set(false);
          resolve(response.id);
        },
        error: () => {
          this.error.set('Kon het bestaande spel niet inladen.');
          this.loading.set(false);
          reject();
        },
      });
    });
  }

  selectCard(cardId: number): void {
    if (this.loading()) return;

    const current = this.selectedCardIds();

    if (current.includes(cardId)) {
      this.selectedCardIds.set(current.filter((id) => id !== cardId));
      return;
    }

    if (current.length >= 3) return;

    const next = [...current, cardId];
    this.selectedCardIds.set(next);

    if (next.length === 3) {
      this.checkSet(next);
    }
  }

  clearSelection(): void {
    this.selectedCardIds.set([]);
  }

  reset(): void {
    this.currentGame.set(null);
    this.selectedCardIds.set([]);
    this.loading.set(false);
    this.error.set(null);
    this.message.set(null);
    localStorage.removeItem('currentGame');
  }

  private checkSet(cardIds: number[]): void {
    const game = this.currentGame();
    if (!game) return;

    this.loading.set(true);
    this.error.set(null);
    this.message.set(null);

    this.api.checkSet(game.id, cardIds).subscribe({
      next: (response: GameResponse) => {
        this.currentGame.set(response);
        this.saveGameToStorage();
        this.selectedCardIds.set([]);

        const selectedRemoved = cardIds.every(
          (id) => !response.cards.some((card) => card.id === id),
        );

        if (response.status === 'Won') {
          this.message.set('🎉 Je hebt gewonnen!');
        } else if (selectedRemoved) {
          this.message.set('✅ Geldige set!');
        } else {
          this.message.set('❌ Geen geldige set. Probeer opnieuw.');
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Set check mislukt.');
        this.loading.set(false);
      },
    });
  }
}
