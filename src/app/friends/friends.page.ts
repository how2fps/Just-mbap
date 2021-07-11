import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDetailsFull } from '../models/user.model';
import { FriendsService } from './friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss'],
})
export class FriendsPage implements OnInit {
  friends$: Observable<UserDetailsFull[]>;
  constructor(private friendsService: FriendsService) {}
  ngOnInit() {
    this.friends$ = this.friendsService.getAllFriends();
  }
}
