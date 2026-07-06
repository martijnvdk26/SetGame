import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
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
  possibleSetsOnBoard: number;
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
  possibleSetsOnBoard: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentGame = signal<GameResponse | null>(null);
  private selectedCardIds = signal<number[]>([]);
  private hintedCardIds = signal<number[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);
  private message = signal<string | null>(null);

  game = computed(() => this.currentGame());
  selectedIds = computed(() => this.selectedCardIds());
  hintedIds = computed(() => this.hintedCardIds());
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

  startNewGame(): Observable<GameResponse> {
  this.loading.set(true); this.error.set(null); this.message.set(null);
  return this.api.startGame().pipe(
    tap((response: GameResponse) => {
      this.currentGame.set(response);
      this.saveGameToStorage();
      this.selectedCardIds.set([]);
      this.hintedCardIds.set([]);
    }),
    catchError((err) => { this.error.set('Kon geen nieuw spel starten.'); return throwError(() => err); }),
    finalize(() => this.loading.set(false)),
  );
}



loadExistingGame(gameId: number): Observable<GameResponse> {
  this.loading.set(true); this.error.set(null); this.message.set(null);
  return this.api.getGame(gameId).pipe(
    tap((response: GameResponse) => {
      this.currentGame.set(response);
      this.saveGameToStorage();
      this.selectedCardIds.set([]);
      this.hintedCardIds.set([]);
    }),
    catchError((err) => { this.error.set('Kon het bestaande spel niet inladen.'); return throwError(() => err); }),
    finalize(() => this.loading.set(false)),
  );
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

  requestHint(): void {
  const game = this.currentGame();
  if (!game || this.loading()) return;
  this.loading.set(true); this.error.set(null); this.message.set(null);
  this.api.getHint(game.id).pipe(
    tap((cardIds: number[]) => this.hintedCardIds.set(cardIds)),
    catchError((err) => {
      console.error('De exacte foutmelding van de backend is:', err);
      this.error.set('Kon geen hint ophalen. Is er wel een set mogelijk?');
      return throwError(() => err);
    }),
    finalize(() => this.loading.set(false)),
  ).subscribe({ error: () => {} });
}



  reset(): void {
    this.currentGame.set(null);
    this.selectedCardIds.set([]);
    this.hintedCardIds.set([]);
    this.loading.set(false);
    this.error.set(null);
    this.message.set(null);
    localStorage.removeItem('currentGame');
  }

  private checkSet(cardIds: number[]): void {
  const game = this.currentGame();
  if (!game) return;
  this.loading.set(true); this.error.set(null); this.message.set(null);
  this.api.checkSet(game.id, cardIds).pipe(
    tap((response: GameResponse) => {
      this.currentGame.set(response);
      this.saveGameToStorage();
      this.selectedCardIds.set([]);
      this.hintedCardIds.set([]);
      const selectedRemoved = cardIds.every((id) => !response.cards.some((c) => c.id === id));
      if (response.status === 'Won') this.message.set('🎉 Je hebt gewonnen!');
      else if (selectedRemoved) this.message.set('✅ Geldige set!');
      else this.message.set('❌ Geen geldige set. Probeer opnieuw.');
    }),
    catchError((err) => { this.error.set('Set check mislukt.'); return throwError(() => err); }),
    finalize(() => this.loading.set(false)),
  ).subscribe({ error: () => {} });
}


}
