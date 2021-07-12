import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserDetailsFull } from 'src/app/models/user.model';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  userDetails: UserDetailsFull;
  isLoading = true;
  constructor(
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id) => this.friendsService.getFriendProfile(id)),
        tap((userDetails) => {
          this.userDetails = userDetails;
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  deleteFriend(userFriendId: string, friendDocId: string) {
    this.friendsService
      .deleteFriend(userFriendId, friendDocId)
      .pipe(tap(() => this.router.navigate(['/tabs', 'friends'])))
      .subscribe();
  }
}
