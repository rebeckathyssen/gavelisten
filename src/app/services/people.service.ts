import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, doc, addDoc, updateDoc, deleteDoc,
  collectionData, query, where
} from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';

export type WishStatus = 'none' | 'selected' | 'purchased' | 'wrapped';

export interface Person {
  id?: string;
  name: string;
  title?: string | null;
  iconUrl?: string | null; //fa-icon name
  budget?: number | null;
  createdAt?: number;
}

export interface Wish {
  id?: string;
  title: string;
  link?: string | null;
  price?: number | null;
  notes?: string | null;
  status: WishStatus;
  type: 'wishlist' | 'idea';
  createdAt?: number;
}

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private fs = inject(Firestore);
  private auth = inject(AuthService);

  private userPath() {
    const uid = this.auth.uid;
    if (!uid) throw new Error('Not authenticated yet');
    return `users/${uid}`;
  }

  people$() {
    const ref = collection(this.fs, `${this.userPath()}/people`);
    return collectionData(ref, { idField: 'id' }) as any;
  }

  addPerson(p: Person) {
    const ref = collection(this.fs, `${this.userPath()}/people`);
    return from(addDoc(ref, { ...p, createdAt: Date.now() }));
  }

  updatePerson(id: string, partial: Partial<Person>) {
    const ref = doc(this.fs, `${this.userPath()}/people/${id}`);
    return from(updateDoc(ref, { ...partial }));
  }

  deletePerson(id: string) {
    const ref = doc(this.fs, `${this.userPath()}/people/${id}`);
    return from(deleteDoc(ref));
  }

  wishes$(personId: string, type?: 'wishlist' | 'idea') {
    const ref = collection(this.fs, `${this.userPath()}/people/${personId}/wishes`);
    const q = type ? query(ref, where('type', '==', type)) : ref;
    return collectionData(q, { idField: 'id' }) as any;
  }
}
