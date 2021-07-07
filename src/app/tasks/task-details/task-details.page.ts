import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable, pipe, Subject, timer } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
  taskDetails: Task;
  timeAllocated: number;
  timerRunning: boolean = false;
  stopTimer$ = new Subject();
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id) => this.taskService.getTaskDetails(id)),
        tap((result) => {
          this.taskDetails = result;
          this.timeAllocated = result.timeAllocated;
          console.log(this.timeAllocated);
        })
      )
      .subscribe();
  }

  startTimer() {
    timer(0, 1000)
      .pipe(
        takeUntil(this.stopTimer$),
        tap(() => {
          if (this.timeAllocated === 0) {
            this.stopTimer$.next();
            return;
          }
          this.timeAllocated -= 1;
        })
      )
      .subscribe();
  }
  stopTimer() {
    this.timerRunning = false;
    this.stopTimer$.next();
  }
}
