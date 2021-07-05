import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable = this.fireAuth.user.pipe(
    map((user) => {
      if (user) {
        const displayName = user.displayName;
        const email = user.email;
        const uid = user.uid;
        const userDetails = {
          displayName,
          email,
          uid,
        };
        return userDetails;
      } else {
        return null;
      }
    }),
    tap((result) => console.log(result))
  );
  constructor(private fireAuth: AngularFireAuth) {}

  login(loginDetails: { email: string; password: string }) {
    this.fireAuth
      .signInWithEmailAndPassword(loginDetails.email, loginDetails.password)
      .then(() => {})
      .catch((err) => console.log(err));
  }

  getCurrentUser$() {
    return this.fireAuth.user.pipe(
      map((user) => {
        if (user) {
          const displayName = user.displayName;
          const email = user.email;
          const uid = user.uid;
          const userDetails = {
            displayName,
            email,
            uid,
          };
          return userDetails;
        } else {
          return null;
        }
      }),
      tap((result) => console.log(result))
    );
  }

  logout() {
    this.fireAuth.signOut();
  }
}
