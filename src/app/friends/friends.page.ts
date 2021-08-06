import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDetailsFull } from '../models/user.model';
import { FriendsService } from './friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss'],
})
export class FriendsPage implements OnInit, OnDestroy {
  friends: UserDetailsFull[];
  private subscriptions = new Subscription();
  constructor(
    private friendsService: FriendsService,
    private router: Router,
    private toastController: ToastController
  ) {}
  ngOnInit() {
    this.subscriptions.add(
      this.friendsService
        .getAllFriends()
        .pipe(tap((result) => (this.friends = result)))
        .subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  goToAddFriends() {
    this.router.navigate(['/add-friends']);
  }

  goToFriendProfile(friendDocId: string) {
    this.router.navigate(['/friends', friendDocId]);
  }

  deleteFriend(
    friendFriendId: string,
    friendDocId: string,
    friendDisplayName: string
  ) {
    this.friendsService
      .deleteFriend(friendFriendId, friendDocId)
      .pipe(
        tap(() => {
          this.friends = this.friends.filter(
            (friend) => friend.friendId !== friendFriendId
          );
          this.toastController
            .create({
              message:
                'You have removed ' +
                friendDisplayName +
                ' from your friend list.',
              duration: 2000,
              buttons: [
                {
                  text: 'X',
                  role: 'cancel',
                },
              ],
            })
            .then((toast) => toast.present());
        })
      )
      .subscribe();
  }
}
