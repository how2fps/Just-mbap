import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private friendsService: FriendsService, private router: Router) {}
  ngOnInit() {
    this.friends$ = this.friendsService.getAllFriends();
  }

  goToAddFriends() {
    this.router.navigate(['/add-friends']);
  }
}
