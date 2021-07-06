import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: 'all-tasks.page.html',
  styleUrls: ['all-tasks.page.scss'],
})
export class AllTasksPage implements OnInit, OnDestroy {
  eventSource = [];
  viewTitle: string;
  currentMonth: Date;
  tasks$: Observable<Task[]>;
  currentDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  currentDateSub: Subscription;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }

  ngOnInit() {
    this.currentDateSub = this.currentDate$
      .pipe(
        tap((result) => console.log(result)),
        switchMap((date) => this.taskService.getTasksByDate(date)),
        tap((result) => console.log(result))
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.currentDateSub.unsubscribe();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.currentDate$.next(ev.selectedTime);
  }
}
