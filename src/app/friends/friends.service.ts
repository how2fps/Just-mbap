import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
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

  sendFriendRequest(friendId: string) {
    let senderDetails;
    return this.afs
      .collection('users', (ref) => ref.where('friendId', '==', friendId))
      .get()
      .pipe(
        map((result) => result.empty),
        switchMap((userDoesNotExist) => {
          if (userDoesNotExist) {
            return of(null);
          }
          return this.userService.getUserDetails$();
        }),
        switchMap((userDetails) => {
          if (userDetails) {
            senderDetails = {
              senderFriendId: userDetails.friendId,
              senderDisplayName: userDetails.displayName,
            };
            return this.afs
              .collection('friendRequests', (ref) =>
                ref
                  .where(
                    'senderDetails.senderFriendId',
                    '==',
                    senderDetails.senderFriendId
                  )
                  .where('friendId', '==', friendId)
              )
              .get();
          }
          return of(null);
        }),
        switchMap((result) => {
          if (result) {
            if (result.docs.length >= 1) {
              return of({ existingFriendRequest: true });
            }
            return this.afs
              .collection('friendRequests')
              .add({
                senderDetails,
                friendId,
              })
              .then(() => ({ existingFriendRequest: false }));
          }
          return of(null);
        })
      );
  }

  getAllFriendRequests() {
    return this.userService.getUserDetails$().pipe(
      map((userDetails) => userDetails.friendId),
      switchMap((friendId) =>
        this.afs
          .collection('friendRequests', (ref) =>
            ref.where('friendId', '==', friendId)
          )
          .snapshotChanges()
      )
    );
  }
}
