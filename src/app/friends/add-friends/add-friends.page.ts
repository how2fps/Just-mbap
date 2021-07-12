import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FriendRequest } from 'src/app/models/friend-request.model';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss'],
})
export class AddFriendsPage implements OnInit {
  addFriendForm: FormGroup;
  friendRequestDetails$: Observable<
    { displayName: string; friendRequestId: string }[]
  >;
  constructor(
    private friendsService: FriendsService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
    this.friendRequestDetails$ = this.friendsService.getAllFriendRequests();
  }

  initForm() {
    this.addFriendForm = new FormGroup({
      friendId: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  acceptFriendRequest(friendRequestId: string) {
    this.friendsService.acceptFriendRequest(friendRequestId);
  }

  declineFriendRequest(friendRequestId: string) {
    this.friendsService.declineFriendRequest(friendRequestId).subscribe();
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      const friendId = this.addFriendForm.value.friendId;
      this.friendsService
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
        .subscribe();
    });
  }
}
