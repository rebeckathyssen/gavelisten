import { Component, signal, inject, computed, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonService } from '../../services/person.service';
import { WishService, WishStatus, Wish } from '../../services/wish.service';
import { switchMap, of } from 'rxjs';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { WishAdderLogic, ParsedWish } from '../../components/wish-adder-logic/wish-adder-logic';
import { Wishlist } from '../../components/wishlist/wishlist';
import { Ideaslist } from '../../components/ideaslist/ideaslist';

@Component({
  selector: 'app-persons-giftlist',
  imports: [FormsModule, WishAdderLogic, Wishlist, Ideaslist],
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
  isEditingPerson = signal(false);
  editName = signal('');
  editBudget = signal(0);
  isSavingPerson = signal(false);
  showPersonMenu = signal(false);
  showWishUploader = signal(false);
  isUploadingWishes = signal(false);

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

    this.showPersonMenu.set(false);
    
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
  startEditingPerson() {
    const p = this.person();
    if (!p) return;
    
    this.editName.set(p.name);
    this.editBudget.set(p.budget);
    this.isEditingPerson.set(true);
    this.showPersonMenu.set(false);
  }

  cancelEditingPerson() {
    this.isEditingPerson.set(false);
  }

  togglePersonMenu() {
    this.showPersonMenu.update(val => !val);
  }

  closePersonMenu() {
    this.showPersonMenu.set(false);
  }

  async savePersonEdit() {
    const p = this.person();
    if (!p || !p.id) return;

    const name = this.editName().trim();
    const budget = this.editBudget();

    if (!name) {
      alert('Navnet må ikke være tomt');
      return;
    }

    if (budget < 0) {
      alert('Budget skal være et positivt tal');
      return;
    }

    this.isSavingPerson.set(true);
    try {
      await this.personService.update(p.id, {
        name,
        budget,
      });
      this.isEditingPerson.set(false);
    } catch (error) {
      console.error('Error updating person:', error);
      alert('Der opstod en fejl ved opdatering. Prøv igen.');
    } finally {
      this.isSavingPerson.set(false);
    }
  }

  close() {
    this.router.navigate(['/']);
  }

  openWishUploader() {
    this.showWishUploader.set(true);
  }

  closeWishUploader() {
    this.showWishUploader.set(false);
  }

  async handleBulkWishes(parsedWishes: ParsedWish[]) {
    const personId = this.personId();
    if (!personId) return;

    this.isUploadingWishes.set(true);

    try {
      // Convert parsed wishes to Wish objects
      const wishes = parsedWishes.map((pw) => {
        const wish: any = {
          personId,
          type: this.activeTab(),
          name: pw.name,
          price: 0,
          notes: '',
          status: 'mangler' as WishStatus,
        };
        
        // Only add link if it exists
        if (pw.link) {
          wish.link = pw.link;
        }
        
        return wish;
      });

      // Add all wishes in bulk
      await this.wishService.addBulk(wishes);

      this.showWishUploader.set(false);
    } catch (error) {
      console.error('Error uploading wishes:', error);
      alert('Der opstod en fejl ved upload af ønsker. Prøv igen.');
    } finally {
      this.isUploadingWishes.set(false);
    }
  }
}
