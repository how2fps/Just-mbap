import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  showTabs: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(
        tap((userDetails) => {
          if (userDetails) {
            this.showTabs = true;
          } else {
            this.showTabs = false;
          }
        })
      )
      .subscribe();
  }
}
