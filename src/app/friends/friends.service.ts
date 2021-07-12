import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FriendRequest } from '../models/friend-request.model';
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
    const receiverFriendId = friendId;
    let friendsArray: string[];
    let senderFriendId: string;
    return this.afs
      .collection('users', (ref) =>
        ref.where('friendId', '==', receiverFriendId)
      )
      .get()
      .pipe(
        map((result) => result.empty),
        switchMap((userDoesNotExist) => {
          if (userDoesNotExist) {
            return of(null);
          }
          return this.userService.getUserDetails$();
        }),
        switchMap((userDetails: UserDetailsFull | null) => {
          if (!userDetails) {
            return of(null);
          }
          friendsArray = userDetails.friends;
          senderFriendId = userDetails.friendId;
          if (
            friendsArray.indexOf(receiverFriendId) !== -1 ||
            senderFriendId === receiverFriendId
          ) {
            return of(null);
          }
          return combineLatest([
            this.afs
              .collection<FriendRequest>('friendRequests', (ref) =>
                ref
                  .where('senderFriendId', '==', senderFriendId)
                  .where('receiverFriendId', '==', receiverFriendId)
              )
              .get(),
            this.afs
              .collection<FriendRequest>('friendRequests', (ref) =>
                ref
                  .where('senderFriendId', '==', receiverFriendId)
                  .where('receiverFriendId', '==', senderFriendId)
              )
              .get(),
          ]);
        }),
        switchMap((results) => {
          if (!results) {
            return of(null);
          }
          if (results[0].docs.length > 0 || results[1].docs.length > 0) {
            return of({ existingFriendRequest: true });
          }
          return from(
            this.afs.collection('friendRequests').add({
              senderFriendId,
              receiverFriendId,
            })
          ).pipe(map(() => ({ existingFriendRequest: false })));
        })
      );
  }

  getAllFriendRequests() {
    return this.userService.getUserDetails$().pipe(
      map((userDetails) => userDetails.friendId),
      switchMap((friendId) =>
        this.afs
          .collection<FriendRequest>('friendRequests', (ref) =>
            ref.where('receiverFriendId', '==', friendId)
          )
          .snapshotChanges()
      ),
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as FriendRequest;
          return data.senderFriendId;
        })
      ),
      switchMap((senderFriendIdArray) =>
        combineLatest(
          senderFriendIdArray.map((senderFriendId) =>
            this.afs
              .collection('users', (ref) =>
                ref.where('friendId', '==', senderFriendId)
              )
              .snapshotChanges()
              .pipe(
                map((actions) =>
                  actions.map((a) => {
                    const data = a.payload.doc.data() as UserDetailsFull;
                    const displayName = data.displayName;
                    const friendRequestId = a.payload.doc.id;
                    const friendDetails = { displayName, friendRequestId };
                    return friendDetails;
                  })
                )
              )
          )
        )
      ),
      map((result) => {
        const displayNameArray: {
          displayName: string;
          friendRequestId: string;
        }[] = [];
        result.forEach((res) => displayNameArray.push(res[0]));
        return displayNameArray;
      })
    );
  }

  acceptFriendRequest(friendRequestId: string) {}
  declineFriendRequest(friendRequestId: string) {
    return from(
      this.afs.collection('friendsRequest').doc(friendRequestId).delete()
    );
  }
}
