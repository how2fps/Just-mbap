import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginDetails, UserDetails } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<UserDetails> = this.fireAuth.user.pipe(
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
    })
  );

  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  login(loginDetails: LoginDetails) {
    return this.fireAuth.signInWithEmailAndPassword(
      loginDetails.email,
      loginDetails.password
    );
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
      })
    );
  }

  logout() {
    this.fireAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => console.log(err));
  }
}
