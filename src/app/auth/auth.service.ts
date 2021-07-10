import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginDetails, UserDetails } from '../models/user.model';
import firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

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

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {}

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

  signUp(email, password) {
    console.log('hi');
    let uid;
    return this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        uid = result.user.uid;
        return this.generateFriendId();
      })
      .then((friendId) => {
        console.log(friendId);
        this.afs.collection('users').doc(uid).set({
          email,
          displayName: email,
          status: '...',
          currentStreak: 0,
          highestStreak: 0,
          friends: [],
          friendId,
        });
      });
  }

  private generateRandomThreeLetters() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return (
      alphabet[Math.floor(Math.random() * alphabet.length)] +
      alphabet[Math.floor(Math.random() * alphabet.length)] +
      alphabet[Math.floor(Math.random() * alphabet.length)]
    );
  }

  private generateFriendId() {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    const ref = db.collection('users').doc('friendId');
    const batch = db.batch();
    batch.set(
      ref,
      {
        currentFriendId: increment,
      },
      { merge: true }
    );
    return batch
      .commit()
      .then(() =>
        this.afs
          .collection('users')
          .doc<{ currentFriendId: number }>('friendId')
          .get()
          .toPromise()
      )
      .then((data) => {
        const uniqueFriendId =
          this.generateRandomThreeLetters() + data.data().currentFriendId;
        return uniqueFriendId;
      });
  }
}
