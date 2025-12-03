import { Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Person, PersonService, Status } from '../../services/person.service';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-overview',
  imports: [CurrencyPipe],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  private router = inject(Router);
  private personService = inject(PersonService);

  // Get people from Firebase
  people = toSignal(this.personService.getAll(), { initialValue: [] });
  isLoading = signal(true);

  constructor() {
    effect(() => {
      const persons = this.people();
      if (persons) {
        this.isLoading.set(false);
      }
    });
  }

  labelFor(status: Status) {
    switch (status) {
      case 'not-bought': return 'circle';
      case 'purchased': return 'circle-check';
      case 'in-progress': return 'clock';
    }
  }

  statusText(status: Status) {
    switch (status) {
      case 'not-bought': return 'Ikke startet';
      case 'purchased': return 'Købt';
      case 'in-progress': return 'I gang';
    }
  }

  openPerson(p: Person) {
    if (p.id) {
      this.router.navigate(['/person', p.id]);
    }
  }

  addPerson() {
    this.router.navigate(['/person/add']);
  }
}
