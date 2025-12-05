import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-add',
  imports: [FormsModule],
  templateUrl: './person-add.html',
  styleUrl: './person-add.scss',
})
export class PersonAdd {
  private router = inject(Router);
  private personService = inject(PersonService);

  name = signal('');
  budget = signal(500);
  selectedAvatar = signal('🙂');
  isSaving = signal(false);

  avatars = ['🙂', '👨', '👩', '🧑', '👦', '👧', '🧒', '👴', '👵', '👶', '🧔', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '🎅'];

  selectAvatar(avatar: string) {
    this.selectedAvatar.set(avatar);
  }

  async save() {
    if (!this.name().trim()) {
      alert('Indtast venligst et navn');
      return;
    }

    this.isSaving.set(true);
    try {
      await this.personService.add({
        name: this.name(),
        status: 'not-bought',
        budget: this.budget(),
        avatar: this.selectedAvatar(),
      });
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error adding person:', error);
      alert('Der opstod en fejl. Prøv igen.');
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
