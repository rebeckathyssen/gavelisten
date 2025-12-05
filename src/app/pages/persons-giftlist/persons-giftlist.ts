import { Component, signal, inject, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonService } from '../../services/person.service';
import { WishService, WishStatus, Wish } from '../../services/wish.service';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-persons-giftlist',
  imports: [CurrencyPipe],
  templateUrl: './persons-giftlist.html',
  styleUrl: './persons-giftlist.scss',
})
export class PersonsGiftlist {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private personService = inject(PersonService);
  private wishService = inject(WishService);
  
  activeTab = signal<'wishlist' | 'ideas'>('wishlist');

  constructor() {
    // Read tab from query params and update activeTab
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab') as 'wishlist' | 'ideas' | null;
      if (tab === 'ideas' || tab === 'wishlist') {
        this.activeTab.set(tab);
      }
    });
  }

  // Get person ID from route
  private personId = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id') || ''))
    ),
    { initialValue: '' }
  );

  // Get person from Firebase
  person = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.personService.getById(id) : of(undefined);
      })
    )
  );

  // Get wishlist and ideas from Firebase
  wishlist = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.wishService.getByPerson(id, 'wishlist') : of([]);
      })
    ),
    { initialValue: [] }
  );

  ideas = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id ? this.wishService.getByPerson(id, 'ideas') : of([]);
      })
    ),
    { initialValue: [] }
  );

  switchTab(tab: 'wishlist' | 'ideas') {
    this.activeTab.set(tab);
  }

  normalizeUrl(url: string): string {
    if (!url) return '';
    const trimmed = url.trim();
    // Check if URL already has a protocol
    if (trimmed.match(/^[a-zA-Z]+:\/\//)) {
      return trimmed;
    }
    // Add https:// if missing
    return `https://${trimmed}`;
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

  async editWish(wish: Wish) {
    const personId = this.personId();
    if (!wish.id || !personId) return;

    this.router.navigate(['/person', personId, 'wish', wish.id, 'edit'], {
      queryParams: { tab: this.activeTab() }
    });
  }

  async deleteWish(wish: Wish) {
    if (!wish.id) return;
    
    if (confirm(`Er du sikker på at du vil slette "${wish.name}"?`)) {
      try {
        await this.wishService.delete(wish.id);
      } catch (error) {
        console.error('Error deleting wish:', error);
      }
    }
  }

  async addWish() {
    const personId = this.personId();
    if (!personId) return;

    this.router.navigate(['/person', personId, 'wish', 'add'], {
      queryParams: { type: this.activeTab(), tab: this.activeTab() }
    });
  }

  async toggleComplete() {
    const p = this.person();
    if (!p || !p.id) return;

    try {
      await this.personService.update(p.id, {
        completed: !p.completed
      });
    } catch (error) {
      console.error('Error toggling complete status:', error);
    }
  }

  async deletePerson() {
    const p = this.person();
    if (!p || !p.id) return;

    if (confirm(`Er du sikker på at du vil slette ${p.name}? Dette vil også slette alle ønsker og idéer.`)) {
      try {
        await this.personService.delete(p.id);
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Der opstod en fejl ved sletning. Prøv igen.');
      }
    }
  }

  close() {
    this.router.navigate(['/']);
  }
}
