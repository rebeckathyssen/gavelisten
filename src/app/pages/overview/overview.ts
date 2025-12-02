import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { Person, PersonService } from '../../services/person.service';

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview implements OnInit {
  private auth = inject(Auth);
  private personSvc = inject(PersonService);
  persons = signal<Person[]>([]);

  async ngOnInit() {
    // Sign in anonymously first
    await signInAnonymously(this.auth);
    
    this.personSvc.getAll().subscribe(list => this.persons.set(list));
    // console.log('Persons:', this.persons());
    console.log('Overview initialized');
    console.log(this.persons());
  }
}
