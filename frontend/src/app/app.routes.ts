import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './login';
import { GameBoardComponent } from './game-board';
import { RegisterComponent } from './register';
import { GamesOverviewComponent } from './games-overview'; // Vergeet de import niet

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'games', component: GamesOverviewComponent, canActivate: [authGuard] }, // Nieuwe overzichtspagina
  { path: 'game-board', component: GameBoardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
