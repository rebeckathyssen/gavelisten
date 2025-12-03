import { Routes } from '@angular/router';
import { Overview } from './pages/overview/overview';
import { PersonsGiftlist } from './pages/persons-giftlist/persons-giftlist';
import { PersonAdd } from './pages/person-add/person-add';
import { WishAdd } from './pages/wish-add/wish-add';

export const routes: Routes = [
  { path: '', component: Overview },
  { path: 'person/add', component: PersonAdd },
  { path: 'person/:personId/wish/add', component: WishAdd },
  { path: 'person/:id', component: PersonsGiftlist },
];
