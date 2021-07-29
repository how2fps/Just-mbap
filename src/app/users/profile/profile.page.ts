import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userDetails$: Observable<any>;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userDetails$ = this.userService.getUserDetails$().pipe(
      map((res) => ({ res, loading: false })),
      startWith({ res: undefined, loading: true })
    );
  }

  goToEditDetails() {
    this.router.navigate(['/editprofile']);
  }

  logout() {
    this.authService.logout();
  }
}
