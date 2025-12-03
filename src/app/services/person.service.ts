import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, doc, addDoc, updateDoc, deleteDoc, docData, Timestamp, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, delay } from 'rxjs/operators';
import { WishService } from './wish.service';

export interface Person {
  id?: string;
  name: string;
  status: Status;
  budget: number;
  spent?: number;
  avatar?: string;
  completed?: boolean;
  ownerId: string;
  createdAt?: Timestamp | Date;
}

export type Status = 'not-bought' | 'purchased' | 'in-progress';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private wishService = inject(WishService);
  private personsCol = collection(this.firestore, 'persons');
  private wishesCol = collection(this.firestore, 'wishes');

  private getCurrentUserId(): string | undefined {
    return this.auth.currentUser?.uid;
  }

  getAll(): Observable<Person[]> {
    // Wait a bit for auth to be ready on initial load
    return new Observable(observer => {
      // Small delay to ensure auth is initialized
      const checkAuth = () => {
        const uid = this.getCurrentUserId();
        if (uid) {
          const q = query(
            this.personsCol, 
            where('ownerId', '==', uid),
            orderBy('createdAt', 'desc')
          );
          collectionData(q, { idField: 'id' }).pipe(
            switchMap((persons: any[]) => {
              if (persons.length === 0) {
                return of([]);
              }
              
              // Get wishes for all persons
              const personWithWishes$ = persons.map(person => {
                const wishesQuery = query(
                  this.wishesCol,
                  where('ownerId', '==', uid),
                  where('personId', '==', person.id)
                );
                
                return collectionData(wishesQuery).pipe(
                  map((wishes: any[]) => {
                    // Calculate spent from wishes with status 'købt' or 'pakket-ind'
                    const spent = wishes
                      .filter(w => w.status === 'købt' || w.status === 'pakket-ind')
                      .reduce((sum, w) => sum + (w.price || 0), 0);
                    
                    // Determine overall status based on budget, completion, and wishes
                    let status: Status = 'not-bought';
                    
                    if (person.completed || spent >= person.budget) {
                      // Marked as complete OR budget is met/exceeded
                      status = 'purchased';
                    } else if (wishes.length > 0 && spent > 0) {
                      // Has wishes and some money spent, but not complete
                      status = 'in-progress';
                    }
                    
                    return {
                      ...person,
                      spent,
                      status
                    } as Person;
                  })
                );
              });
              
              return combineLatest(personWithWishes$);
            })
          ).subscribe(persons => {
            observer.next(persons);
          });
        } else {
          // Retry after a short delay
          setTimeout(checkAuth, 100);
        }
      };
      checkAuth();
    });
  }

  getById(id: string): Observable<Person | undefined> {
    const personDoc = doc(this.firestore, `persons/${id}`);
    return docData(personDoc, { idField: 'id' }) as Observable<Person | undefined>;
  }

  async add(person: Omit<Person, 'id' | 'createdAt' | 'ownerId'>): Promise<string> {
    const uid = this.getCurrentUserId();
    if (!uid) throw new Error('User not authenticated');
    
    const newPerson = {
      ...person,
      ownerId: uid,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(this.personsCol, newPerson);
    return docRef.id;
  }

  async update(id: string, person: Partial<Person>): Promise<void> {
    const personDoc = doc(this.firestore, `persons/${id}`);
    await updateDoc(personDoc, { ...person });
  }

  async delete(id: string): Promise<void> {
    // Delete all wishes associated with this person first
    await this.wishService.deleteByPerson(id);
    
    // Then delete the person
    const personDoc = doc(this.firestore, `persons/${id}`);
    await deleteDoc(personDoc);
  }
}
