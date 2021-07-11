import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
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
      friendId: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      const friendId = this.addFriendForm.value.friendId;
      this.friendsService.sendFriendRequest(friendId);
    });
  }
}
