import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { UserDetailsFull } from 'src/app/models/user.model';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  userDetails: UserDetailsFull;
  friendTasks: Task[];
  isLoading = true;
  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    let friendId: string;
    this.isLoading = true;
    this.route.paramMap
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
        })
      )
      .subscribe();
  }
}
