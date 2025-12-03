import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { Person, PersonService, Status } from '../../services/person.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-overview',
  imports: [CurrencyPipe],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
   // Demo-data
  readonly people = signal<Person[]>([
    { id: 1, name: 'Sophie', status: 'not-bought', budget: 50, avatar: '👩🏻' },
    { id: 2, name: 'Jacob', status: 'purchased', budget: 40, spent: 40, avatar: '🧔🏽' },
    { id: 3, name: 'Emily', status: 'in-progress', budget: 75, spent: 30, avatar: '🎅' },
    { id: 4, name: 'Daniel', status: 'not-bought', budget: 60, avatar: '🧑🏼' },
  ]);

  labelFor(status: Status) {
    switch (status) {
      case 'not-bought': return 'Ikke startet';
      case 'purchased': return 'Købt';
      case 'in-progress': return 'I gang';
    }
  }

  badgeClass(status: Status) {
    return {
      'badge--not-bought': status === 'not-bought',
      'badge--purchased': status === 'purchased',
      'badge--progress': status === 'in-progress',
    };
  }

  openPerson(p: Person) {
    // TODO: navigér/åbn sidepanel mv.
    console.log('Open', p);
  }

  addPerson() {
    // TODO: åbn dialog/route – demo:
    const ids = this.people().map(x => x.id).filter((id): id is number => typeof id === 'number');
    const id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    this.people.update(arr => [...arr, { id, name: 'New person', status: 'not-bought', budget: 50, avatar: '🙂' }]);
  }
}
