import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export type WishStatus = 'none' | 'selected' | 'purchased' | 'wrapped';

export interface Person {
  id?: string;
  name: string;
  title?: string | null;
  iconUrl?: string | null;
  budget?: number | null;
  createdAt?: number;
}

@Injectable({ providedIn: 'root' })
export class PersonService {
  private firestore = inject(Firestore);
  private personsCol = collection(this.firestore, 'persons');

  /** Henter alle personer som realtime stream (orderby createdAt desc) */
  getAll(): Observable<Person[]> {
    const q = query(this.personsCol, orderBy('createdAt', 'desc'));
    // idField sørger for at doc.id mappes til 'id'
    return collectionData(q, { idField: 'id' }) as Observable<Person[]>;
  }
}
