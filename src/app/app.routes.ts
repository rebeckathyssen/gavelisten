import { Routes } from '@angular/router';
import { Overview } from './pages/overview/overview';
import { PersonsGiftlist } from './pages/persons-giftlist/persons-giftlist';

export const routes: Routes = [
  { path: '', component: Overview },
  { path: 'person/:id', component: PersonsGiftlist },
];
