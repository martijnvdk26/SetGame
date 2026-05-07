import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './login';
import { GameBoardComponent} from './game-board';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'game-board', component: GameBoardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
