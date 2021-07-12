import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FriendRequest } from 'src/app/models/friend-request.model';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss'],
})
export class AddFriendsPage implements OnInit, OnDestroy {
  addFriendForm: FormGroup;
  subscriptionArray: Subscription[] = [];
  friendRequests: { displayName: string; friendRequestDocId: string }[];
  constructor(
    private friendsService: FriendsService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
    const subscription = this.friendsService
      .getAllFriendRequests()
      .pipe(tap((friendRequests) => (this.friendRequests = friendRequests)))
      .subscribe(() => this.subscriptionArray.push(subscription));
  }

  ngOnDestroy() {
    this.subscriptionArray.forEach((subscription) =>
      subscription.unsubscribe()
    );
  }

  initForm() {
    this.addFriendForm = new FormGroup({
      friendId: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  acceptFriendRequest(friendRequestId: string, displayName: string) {
    const subscription = this.friendsService
      .acceptFriendRequest(friendRequestId)
      .pipe(
        tap(() => {
          this.friendRequests = this.friendRequests.filter(
            (results) => results.friendRequestDocId !== friendRequestId
          );
          this.toastController
            .create({
              message: 'Accepted friend request from ' + displayName + '.',
              duration: 2000,
            })
            .then((toast) => toast.present());
        })
      )
      .subscribe(() => this.subscriptionArray.push(subscription));
  }

  declineFriendRequest(friendRequestId: string, displayName: string) {
    const subscription = this.friendsService
      .declineFriendRequest(friendRequestId)
      .pipe(
        tap(() => {
          this.friendRequests = this.friendRequests.filter(
            (results) => results.friendRequestDocId !== friendRequestId
          );
          this.toastController
            .create({
              message: 'Declined friend request from ' + displayName + '.',
              duration: 2000,
            })
            .then((toast) => toast.present());
        })
      )
      .subscribe(() => this.subscriptionArray.push(subscription));
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      const friendId = this.addFriendForm.value.friendId;
      const subscription = this.friendsService
        .sendFriendRequest(friendId)
        .pipe(
          tap((result) => {
            let message;
            if (!result) {
              message = 'Invalid Friend ID.';
            } else if (result.existingFriendRequest === true) {
              message =
                'Friend request has already been sent to ' + friendId + '.';
            } else {
              message = 'Friend request sent to Friend ID ' + friendId + '.';
            }
            loader.dismiss();
            this.toastController
              .create({
                message,
                duration: 2000,
              })
              .then((toast) => toast.present());
          })
        )
        .subscribe(() => this.subscriptionArray.push(subscription));
    });
  }
}
