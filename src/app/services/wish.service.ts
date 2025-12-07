import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy, doc, addDoc, updateDoc, deleteDoc, Timestamp, getDocs, writeBatch } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export type WishStatus = 'mangler' | 'købt' | 'pakket-ind';
export type WishType = 'wishlist' | 'ideas';

export interface Wish {
  id?: string;
  personId: string;
  type: WishType;
  name: string;
  price: number;
  notes: string;
  status: WishStatus;
  link?: string;
  ownerId: string;
  createdAt?: Timestamp | Date;
}

@Injectable({ providedIn: 'root' })
export class WishService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private wishesCol = collection(this.firestore, 'wishes');

  private getCurrentUserId(): string | undefined {
    return this.auth.currentUser?.uid;
  }

  getByPerson(personId: string, type: WishType): Observable<Wish[]> {
    const uid = this.getCurrentUserId();
    if (!uid) {
      console.warn('No user authenticated when fetching wishes');
      return new Observable(observer => observer.next([]));
    }
    
    const q = query(
      this.wishesCol, 
      where('ownerId', '==', uid),
      where('personId', '==', personId),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Wish[]>;
  }

  getAllByPerson(personId: string): Observable<Wish[]> {
    const uid = this.getCurrentUserId();
    if (!uid) return new Observable(observer => observer.next([]));
    
    const q = query(
      this.wishesCol, 
      where('ownerId', '==', uid),
      where('personId', '==', personId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Wish[]>;
  }

  async add(wish: Omit<Wish, 'id' | 'createdAt' | 'ownerId'>): Promise<string> {
    const uid = this.getCurrentUserId();
    if (!uid) throw new Error('User not authenticated');
    
    const newWish = {
      ...wish,
      ownerId: uid,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(this.wishesCol, newWish);
    return docRef.id;
  }

  async update(id: string, wish: Partial<Wish>): Promise<void> {
    const wishDoc = doc(this.firestore, `wishes/${id}`);
    await updateDoc(wishDoc, { ...wish });
  }

  async delete(id: string): Promise<void> {
    const wishDoc = doc(this.firestore, `wishes/${id}`);
    await deleteDoc(wishDoc);
  }

  async deleteByPerson(personId: string): Promise<void> {
    const uid = this.getCurrentUserId();
    if (!uid) throw new Error('User not authenticated');
    
    const q = query(
      this.wishesCol,
      where('ownerId', '==', uid),
      where('personId', '==', personId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return;
    
    const batch = writeBatch(this.firestore);
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }

  async addBulk(wishes: Omit<Wish, 'id' | 'createdAt' | 'ownerId'>[]): Promise<void> {
    const uid = this.getCurrentUserId();
    if (!uid) throw new Error('User not authenticated');
    
    const batch = writeBatch(this.firestore);
    const timestamp = Timestamp.now();
    
    wishes.forEach((wish) => {
      const docRef = doc(collection(this.firestore, 'wishes'));
      const newWish = {
        ...wish,
        ownerId: uid,
        createdAt: timestamp,
      };
      batch.set(docRef, newWish);
    });
    
    await batch.commit();
  }
}
