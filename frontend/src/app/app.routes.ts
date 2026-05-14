import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { LoginComponent } from './auth/login/login';
import { GameBoardComponent } from './game/game-board/game-board';
import { GamesOverviewComponent } from './game/games-overview/games-overview';
import { GameStatisticsComponent } from './game/game-statistics/game-statistics/game-statistics';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'games', component: GamesOverviewComponent, canActivate: [authGuard] },
  { path: 'game-board', component: GameBoardComponent, canActivate: [authGuard] },
  { path: 'game-board/:gameId', component: GameBoardComponent, canActivate: [authGuard] },
  { path: 'game/:gameId/statistics', component: GameStatisticsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
