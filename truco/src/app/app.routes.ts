import { Routes } from '@angular/router';
import { TelaJogoComponent } from './tela-jogo/tela-jogo.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app.component').then(m => m.AppComponent)
  },
  {
    path: 'jogo',
    component: TelaJogoComponent
  }
];
