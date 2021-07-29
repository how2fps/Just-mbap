import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserDetailsFull } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  getUserDetails$() {
    return this.authService.currentUser$.pipe(
      filter((userDetails) => userDetails !== null),
      switchMap((userDetails) =>
        this.afs
          .collection<UserDetailsFull>('users')
          .doc(userDetails.uid)
          .snapshotChanges()
      ),
      map((action) => {
        const data = action.payload.data() as UserDetailsFull;
        const id = action.payload.id;
        return { id, ...data };
      })
    );
  }

  getUserDetailsOnce$() {
    return this.authService.currentUser$.pipe(
      switchMap((userDetails) => {
        if (userDetails) {
          return this.afs
            .collection<UserDetailsFull>('users')
            .doc(userDetails.uid)
            .get();
        }
        return of(null);
      }),
      filter((userDetails) => userDetails !== null),
      map((action) => {
        const data = action.data() as UserDetailsFull;
        const id = action.id;
        return { id, ...data };
      })
    );
  }

  updateNameAndStatus(userId: string, name: string, status: string) {
    return from(
      this.afs
        .collection('users')
        .doc(userId)
        .update({ displayName: name, status })
    );
  }
}
