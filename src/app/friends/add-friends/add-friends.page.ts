import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss'],
})
export class AddFriendsPage implements OnInit {
  addFriendForm: FormGroup;
  constructor(
    private friendsService: FriendsService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addFriendForm = new FormGroup({
      friendId: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      const friendId = this.addFriendForm.value.friendId;
      this.friendsService
        .sendFriendRequest(friendId)
        .pipe(
          tap((result) => {
            if (!result) {
              loader.dismiss();
              this.toastController
                .create({
                  message: 'Friend ID ' + friendId + ' does not exist.',
                  duration: 2000,
                })
                .then((toast) => toast.present());
            } else if (result.existingFriendRequest === true) {
              this.addFriendForm.reset();
              loader.dismiss();
              this.toastController
                .create({
                  message:
                    'Friend request has already been sent to ' + friendId + '.',
                  duration: 2000,
                })
                .then((toast) => toast.present());
            } else {
              this.addFriendForm.reset();
              loader.dismiss();
              this.toastController
                .create({
                  message: 'Friend request sent to Friend ID ' + friendId + '.',
                  duration: 2000,
                })
                .then((toast) => toast.present());
            }
          })
        )
        .subscribe();
    });
  }
}
