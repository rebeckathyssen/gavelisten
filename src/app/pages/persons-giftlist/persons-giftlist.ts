import { Component, input, signal, inject, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Person } from '../../services/person.service';

export type WishStatus = 'mangler' | 'købt' | 'pakket-ind';

export interface Wish {
  id: number;
  name: string;
  price: number;
  notes: string;
  status: WishStatus;
  link?: string;
}

@Component({
  selector: 'app-persons-giftlist',
  imports: [CurrencyPipe],
  templateUrl: './persons-giftlist.html',
  styleUrl: './persons-giftlist.scss',
})
export class PersonsGiftlist {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  // TODO: Get person from service based on route param
  // For now, demo data
  person = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const demoData: Person[] = [
      { id: 1, name: 'Sophie', status: 'not-bought', budget: 50, avatar: '👩🏻' },
      { id: 2, name: 'Jacob', status: 'purchased', budget: 40, spent: 40, avatar: '🧔🏽' },
      { id: 3, name: 'Emily', status: 'in-progress', budget: 75, spent: 30, avatar: '🎅' },
      { id: 4, name: 'Daniel', status: 'not-bought', budget: 60, avatar: '🧑🏼' },
    ];
    return demoData.find(p => p.id === id) || demoData[0];
  });
  
  activeTab = signal<'wishlist' | 'ideas'>('wishlist');

  // Demo data
  wishlist = signal<Wish[]>([
    { id: 1, name: 'LEGO Star Wars sæt', price: 450, notes: 'Det store Millennium Falcon', status: 'mangler', link: 'https://www.lego.com' },
    { id: 2, name: 'Bog: The Hobbit', price: 150, notes: 'Paperback udgave', status: 'købt' },
  ]);

  ideas = signal<Wish[]>([
    { id: 3, name: 'Bluetooth højtaler', price: 300, notes: 'Vandtæt til badeværelset', status: 'mangler', link: 'https://www.amazon.com' },
  ]);

  switchTab(tab: 'wishlist' | 'ideas') {
    this.activeTab.set(tab);
  }

  statusText(status: WishStatus) {
    switch (status) {
      case 'mangler': return 'Mangler';
      case 'købt': return 'Købt';
      case 'pakket-ind': return 'Pakket ind';
    }
  }

  statusIcon(status: WishStatus) {
    switch (status) {
      case 'mangler': return 'circle';
      case 'købt': return 'cart-shopping';
      case 'pakket-ind': return 'gift';
    }
  }

  editWish(wish: Wish) {
    console.log('Edit wish', wish);
  }

  deleteWish(wish: Wish) {
    console.log('Delete wish', wish);
  }

  addWish() {
    console.log('Add wish');
  }

  close() {
    this.router.navigate(['/']);
  }
}
