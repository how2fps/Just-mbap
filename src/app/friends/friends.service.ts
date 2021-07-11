import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserDetailsFull } from '../models/user.model';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(
    private userService: UserService,
    private afs: AngularFirestore
  ) {}

  getAllFriends() {
    return this.userService.getUserDetails$().pipe(
      map((userDetails) => userDetails.friends),
      switchMap((friends) =>
        combineLatest(
          friends.map((friendId) =>
            this.afs
              .collection<UserDetailsFull>('users', (ref) =>
                ref.where('friendId', '==', friendId)
              )
              .get()
          )
        )
      ),
      map((result) => {
        const friendArray = [];
        result.forEach((res) => friendArray.push(res.docs[0].data()));
        return friendArray;
      })
    );
  }
}
