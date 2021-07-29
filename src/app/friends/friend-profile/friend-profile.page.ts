import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { UserDetailsFull } from 'src/app/models/user.model';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit, OnDestroy {
  userDetails: UserDetailsFull;
  friendTasks: Task[];
  isLoading = true;
  subscription: Subscription;
  profilePicUrl: string;
  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    let friendId: string;
    this.isLoading = true;
    this.subscription = this.route.paramMap
      .pipe(
        map((paramMap) => {
          friendId = paramMap.get('id');
          return friendId;
        }),
        switchMap((id) => this.friendsService.getFriendProfile(id)),
        tap((userDetails) => {
          this.userDetails = userDetails;
          this.isLoading = false;
        }),
        switchMap(() => this.friendsService.getFriendsVisibleTasks(friendId)),
        tap((tasks) => {
          this.friendTasks = tasks;
        }),
        switchMap(() => {
          const ref = this.storage.ref('Images/' + friendId);
          return ref.getDownloadURL();
        }),
        tap((profilePicUrl) => (this.profilePicUrl = profilePicUrl)),
        catchError((err) => {
          this.profilePicUrl = null;
          return of(null);
        })
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
