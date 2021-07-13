import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: 'all-tasks.page.html',
  styleUrls: ['all-tasks.page.scss'],
})
export class AllTasksPage {
  eventSource = [];
  viewTitle: string;
  currentMonth: Date;
  selectedDate = new Date(Date.now()).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  });
  tasks$: Observable<Task[]>;
  currentDateSub: Subscription;
  currentDate = new Date();

  constructor(private taskService: TaskService, private router: Router) {
    this.tasks$ = this.taskService.currentDate$.pipe(
      switchMap((date) => this.taskService.getTasksByDate(date))
    );
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.selectedDate = ev.selectedTime.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
    });

    this.taskService.currentDate$.next(ev.selectedTime);
  }

  onTaskClick(id: string) {
    this.router.navigate(['task-details', id]);
  }

  editTask(taskDocId: string) {
    this.taskService.editTask(taskDocId);
  }
  deleteTask(taskDocId: string) {
    this.taskService.deleteTask(taskDocId);
  }
}
