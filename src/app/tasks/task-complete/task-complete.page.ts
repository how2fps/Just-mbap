import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { UserService } from 'src/app/users/user.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-complete',
  templateUrl: './task-complete.page.html',
  styleUrls: ['./task-complete.page.scss'],
})
export class TaskCompletePage implements OnInit {
  highestStreak: number;
  currentStreak: number;
  taskDetails: Task;
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskService.taskDetails$
      .pipe(
        tap((taskDetails) => {
          if (!taskDetails) {
            this.router.navigate(['']);
          } else {
            this.taskDetails = taskDetails;
          }
        }),
        filter((taskDetails) => taskDetails !== null),
        switchMap(() => this.userService.getUserDetailsOnce$()),
        tap((userDetails) => {
          this.highestStreak = userDetails.highestStreak;
          this.currentStreak = userDetails.currentStreak;
        })
      )
      .subscribe();
  }
}
