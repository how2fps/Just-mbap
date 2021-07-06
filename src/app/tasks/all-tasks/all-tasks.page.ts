import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: 'all-tasks.page.html',
  styleUrls: ['all-tasks.page.scss'],
})
export class AllTasksPage implements OnInit {
  eventSource = [];
  viewTitle: string;
  currentMonth: Date;
  selectedDate = new Date(Date.now()).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  });
  tasks$: Observable<Task[]>;
  currentDate$ = new BehaviorSubject<Date>(new Date());
  currentDateSub: Subscription;
  calendar = {
    mode: 'month',
    currentDate: Date.now(),
  };

  constructor(private taskService: TaskService, private router: Router) {
    this.tasks$ = this.currentDate$.pipe(
      switchMap((date) => this.taskService.getTasksByDate(date)),
      tap((result) => console.log(result))
    );
  }

  ngOnInit() {}

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.selectedDate = ev.selectedTime.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
    });

    this.currentDate$.next(ev.selectedTime);
  }

  onTaskClick(id: string) {
    this.router.navigate(['task-details', id]);
  }
}
