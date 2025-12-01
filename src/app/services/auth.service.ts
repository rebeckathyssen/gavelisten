import { inject, Injectable } from '@angular/core';
import { Auth, signInAnonymously, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  initAnonymous() {
    onAuthStateChanged(this.auth, (u) => this._user$.next(u));
    // Hvis ikke logget ind endnu → log ind anonymt
    if (!this.auth.currentUser) {
      signInAnonymously(this.auth).catch(console.error);
    }
  }

  get uid() {
    return this.auth.currentUser?.uid ?? null;
  }
}
