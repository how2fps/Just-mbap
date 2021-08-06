import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  userDetails$: Observable<any>;
  profilePicUrl: Observable<any>;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ionViewWillEnter() {
    this.userDetails$ = this.userService.getUserDetails$().pipe(
      map((res) => ({ res, loading: false })),
      startWith({ res: undefined, loading: true })
    );
    this.profilePicUrl = this.authService.currentUser$.pipe(
      map((result) => result.uid),
      switchMap((userId) => {
        const ref = this.storage.ref('Images/' + userId);
        return ref.getDownloadURL();
      }),
      map((res) => ({ res, loading: false })),
      startWith({ res: undefined, loading: true }),
      catchError(() => of({ res: undefined, loading: false }))
    );
  }

  goToEditDetails() {
    this.router.navigate(['/editprofile']);
  }

  logout() {
    this.authService.logout();
  }
}
