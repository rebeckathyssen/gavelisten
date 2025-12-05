import { Component, inject, signal, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WishService, WishType, WishStatus } from '../../services/wish.service';
import { PersonService } from '../../services/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-wish-edit',
  imports: [FormsModule],
  templateUrl: './wish-edit.html',
  styleUrl: './wish-edit.scss',
})
export class WishEdit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private wishService = inject(WishService);
  private personService = inject(PersonService);

  personId = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('personId') || ''))
    ),
    { initialValue: '' }
  );

  wishId = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('wishId') || ''))
    ),
    { initialValue: '' }
  );

  person = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('personId');
        return id ? this.personService.getById(id) : of(undefined);
      })
    )
  );

  name = signal('');
  price = signal(0);
  notes = signal('');
  link = signal('');
  selectedStatus = signal<WishStatus>('mangler');
  wishType = signal<WishType>('wishlist');
  isLoading = signal(true);
  isSaving = signal(false);

  tab = toSignal(
    this.route.queryParamMap.pipe(
      switchMap(params => of(params.get('tab') || 'wishlist'))
    ),
    { initialValue: 'wishlist' }
  );

  statuses: { value: WishStatus; label: string; icon: string }[] = [
    { value: 'mangler', label: 'Mangler', icon: 'circle' },
    { value: 'købt', label: 'Købt', icon: 'cart-shopping' },
    { value: 'pakket-ind', label: 'Pakket ind', icon: 'gift' },
  ];

  constructor() {
    effect(() => {
      const personId = this.personId();
      const wishId = this.wishId();
      
      if (personId && wishId) {
        this.loadWish(personId, wishId);
      }
    });
  }

  private async loadWish(personId: string, wishId: string) {
    try {
      // Get all wishes for this person to find the one we want to edit
      const allWishes = await new Promise<any[]>((resolve) => {
        const sub = this.wishService.getAllByPerson(personId).subscribe(wishes => {
          sub.unsubscribe();
          resolve(wishes);
        });
      });

      const wish = allWishes.find(w => w.id === wishId);
      
      if (wish) {
        this.name.set(wish.name);
        this.price.set(wish.price);
        this.notes.set(wish.notes || '');
        this.link.set(wish.link || '');
        this.selectedStatus.set(wish.status);
        this.wishType.set(wish.type);
      }
      
      this.isLoading.set(false);
    } catch (error) {
      console.error('Error loading wish:', error);
      this.isLoading.set(false);
    }
  }

  selectStatus(status: WishStatus) {
    this.selectedStatus.set(status);
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

  async save() {
    if (!this.name().trim()) {
      alert('Indtast venligst et navn');
      return;
    }

    const personId = this.personId();
    const wishId = this.wishId();
    if (!personId || !wishId) return;

    this.isSaving.set(true);
    try {
      const wishData: any = {
        name: this.name(),
        price: this.price(),
        notes: this.notes(),
        status: this.selectedStatus(),
      };
      
      // Only add link if it has a value, and normalize it
      const linkValue = this.link().trim();
      if (linkValue) {
        wishData.link = this.normalizeUrl(linkValue);
      }
      
      await this.wishService.update(wishId, wishData);
      this.router.navigate(['/person', personId], {
        queryParams: { tab: this.tab() }
      });
    } catch (error) {
      console.error('Error updating wish:', error);
      alert('Der opstod en fejl. Prøv igen.');
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    const personId = this.personId();
    if (personId) {
      this.router.navigate(['/person', personId], {
        queryParams: { tab: this.tab() }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
