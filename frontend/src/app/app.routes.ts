import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './login';
import { GameBoardComponent } from './game-board';
import { RegisterComponent } from './register'; // Belangrijk: importeer de nieuwe component

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // De nieuwe route toegevoegd
  { path: 'game-board', component: GameBoardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
