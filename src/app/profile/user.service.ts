import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
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
      switchMap((userDetails) =>
        this.afs.collection<UserDetailsFull>('users').doc(userDetails.uid).get()
      ),
      map((action) => {
        const data = action.data() as UserDetailsFull;
        const id = action.id;
        return { id, ...data };
      })
    );
  }
}
