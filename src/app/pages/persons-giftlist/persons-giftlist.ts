import { Component, signal, inject, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonService } from '../../services/person.service';
import { WishService, WishStatus, Wish } from '../../services/wish.service';
import { switchMap, of } from 'rxjs';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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
  private auth = inject(Auth);

  activeTab = signal<'wishlist' | 'ideas'>('wishlist');
  isDeletingPerson = signal(false);
  deletingWishId = signal<string | null>(null);

  // Get person ID from route
  private personId = toSignal(
    this.route.paramMap.pipe(switchMap((params) => of(params.get('id') || ''))),
    { initialValue: '' }
  );

  // Get person from Firebase
  person = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.personService.getById(id) : of(undefined);
      })
    )
  );

  // Manual signals for wishes
  wishlist = signal<Wish[]>([]);
  ideas = signal<Wish[]>([]);

  constructor() {
    // Read tab from query params and update activeTab
    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab') as 'wishlist' | 'ideas' | null;
      if (tab === 'ideas' || tab === 'wishlist') {
        this.activeTab.set(tab);
      }
    });

    // Wait for auth state and then load wishes when personId changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Now set up the effect to load wishes
        effect(() => {
          const id = this.personId();

          if (id) {
            // Subscribe to wishlist
            this.wishService.getByPerson(id, 'wishlist').subscribe((wishes) => {
              this.wishlist.set(wishes);
            });
            // Subscribe to ideas
            this.wishService.getByPerson(id, 'ideas').subscribe((ideas) => {
              this.ideas.set(ideas);
            });
          }
        });
      }
    });
  }

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
      case 'mangler':
        return 'Mangler';
      case 'købt':
        return 'Købt';
      case 'pakket-ind':
        return 'Pakket ind';
    }
  }

  statusIcon(status: WishStatus) {
    switch (status) {
      case 'mangler':
        return 'circle';
      case 'købt':
        return 'cart-shopping';
      case 'pakket-ind':
        return 'gift';
    }
  }

  async editWish(wish: Wish) {
    const personId = this.personId();
    if (!wish.id || !personId) return;

    this.router.navigate(['/person', personId, 'wish', wish.id, 'edit'], {
      queryParams: { tab: this.activeTab() },
    });
  }

  async markAsBought(wish: Wish) {
    if (!wish.id || wish.status === 'pakket-ind') return;

    try {
      const newStatus: WishStatus = wish.status === 'mangler' ? 'købt' : 'pakket-ind';
      await this.wishService.update(wish.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating wish status:', error);
      alert('Der opstod en fejl. Prøv igen.');
    }
  }

  async deleteWish(wish: Wish) {
    if (!wish.id) return;

    if (confirm(`Er du sikker på at du vil slette "${wish.name}"?`)) {
      this.deletingWishId.set(wish.id);
      try {
        await this.wishService.delete(wish.id);
      } catch (error) {
        console.error('Error deleting wish:', error);
        alert('Der opstod en fejl ved sletning. Prøv igen.');
      } finally {
        this.deletingWishId.set(null);
      }
    }
  }

  async addWish() {
    const personId = this.personId();
    if (!personId) return;

    this.router.navigate(['/person', personId, 'wish', 'add'], {
      queryParams: { type: this.activeTab(), tab: this.activeTab() },
    });
  }

  async toggleComplete() {
    const p = this.person();
    if (!p || !p.id) return;

    try {
      await this.personService.update(p.id, {
        completed: !p.completed,
      });
    } catch (error) {
      console.error('Error toggling complete status:', error);
    }
  }

  async deletePerson() {
    const p = this.person();
    if (!p || !p.id) return;

    if (
      confirm(
        `Er du sikker på at du vil slette ${p.name}? Dette vil også slette alle ønsker og idéer.`
      )
    ) {
      this.isDeletingPerson.set(true);
      try {
        await this.personService.delete(p.id);
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Der opstod en fejl ved sletning. Prøv igen.');
      } finally {
        this.isDeletingPerson.set(false);
      }
    }
  }

  close() {
    this.router.navigate(['/']);
  }
}
