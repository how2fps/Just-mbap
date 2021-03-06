import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
  allTasksMode: boolean;
  currentDate = new Date();

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.tasks$ = this.taskService.currentDate$.pipe(
      switchMap((date) => {
        if (date === 'all') {
          return this.taskService.getAllTasks();
        } else {
          return this.taskService.getTasksByDate(date);
        }
      })
    );
  }

  getAllTasks() {
    this.allTasksMode = true;
    this.taskService.currentDate$.next('all');
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.allTasksMode = false;
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
    this.router.navigate(['/edit-task', taskDocId]);
  }

  deleteTask(taskDocId: string) {
    this.taskService.deleteTask(taskDocId).subscribe();
  }

  getRandomQuote() {
    this.taskService
      .getRandomQuote()
      .pipe(
        tap((result) => {
          this.toastController
            .create({
              message: result.content,
              duration: 10000,
              position: 'top',
              buttons: [
                {
                  text: 'X',
                  role: 'cancel',
                },
              ],
            })
            .then((toast) => toast.present());
        })
      )
      .subscribe();
  }
}
