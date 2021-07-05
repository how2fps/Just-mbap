import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: 'all-tasks.page.html',
  styleUrls: ['all-tasks.page.scss'],
})
export class AllTasksPage implements OnInit {
  user;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService
      .getCurrentUser$()
      .pipe(tap((result) => (this.user = result)))
      .subscribe();
  }
}
