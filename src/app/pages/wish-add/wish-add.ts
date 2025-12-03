import { Component, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WishService, WishType, WishStatus } from '../../services/wish.service';
import { PersonService } from '../../services/person.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-wish-add',
  imports: [FormsModule],
  templateUrl: './wish-add.html',
  styleUrl: './wish-add.scss',
})
export class WishAdd {
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

  type = toSignal(
    this.route.queryParamMap.pipe(
      switchMap(params => of((params.get('type') || 'wishlist') as WishType))
    ),
    { initialValue: 'wishlist' as WishType }
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

  statuses: { value: WishStatus; label: string; icon: string }[] = [
    { value: 'mangler', label: 'Mangler', icon: 'circle' },
    { value: 'købt', label: 'Købt', icon: 'cart-shopping' },
    { value: 'pakket-ind', label: 'Pakket ind', icon: 'gift' },
  ];

  selectStatus(status: WishStatus) {
    this.selectedStatus.set(status);
  }

  async save() {
    if (!this.name().trim()) {
      alert('Indtast venligst et navn');
      return;
    }

    const personId = this.personId();
    if (!personId) return;

    try {
      const wishData: any = {
        personId,
        type: this.type(),
        name: this.name(),
        price: this.price(),
        notes: this.notes(),
        status: this.selectedStatus(),
      };
      
      // Only add link if it has a value
      const linkValue = this.link().trim();
      if (linkValue) {
        wishData.link = linkValue;
      }
      
      await this.wishService.add(wishData);
      this.router.navigate(['/person', personId]);
    } catch (error) {
      console.error('Error adding wish:', error);
      alert('Der opstod en fejl. Prøv igen.');
    }
  }

  cancel() {
    const personId = this.personId();
    if (personId) {
      this.router.navigate(['/person', personId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
