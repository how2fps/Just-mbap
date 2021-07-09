import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-current-task',
  templateUrl: 'current-task.page.html',
  styleUrls: ['current-task.page.scss'],
})
export class CurrentTaskPage implements OnInit, OnDestroy {
  taskDetails: Task;
  timeAllocated: number;
  taskDoc: AngularFirestoreDocument<Task>;
  timerRunning = false;
  stopTimer$ = new Subject();
  forceUpdateSub: Subscription;
  isLoading = true;
  constructor(
    private router: Router,
    private taskService: TaskService,
    private afs: AngularFirestore
  ) {}

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
    window.localStorage.setItem('timeAllocated', this.timeAllocated.toString());
    window.localStorage.setItem('timeOnLeave', Date.now().toString());
    window.localStorage.setItem('timerRunning', this.timerRunning.toString());
    window.localStorage.setItem('taskId', this.taskDetails.id);
  }

  ngOnInit() {
    this.isLoading = true;
    this.forceUpdateSub = this.taskService.forceUpdate$
      .pipe(
        switchMap((initialTaskId) => {
          if (initialTaskId) {
            this.taskService.forceUpdate$.next(null);
            return this.taskService.getTaskDetails(initialTaskId);
          }
          return this.taskService.getCurrentTask().pipe(
            tap((result) => {
              const taskId = window.localStorage.getItem('taskId');
              this.taskDetails = result;
              if (!result) {
                window.localStorage.clear();
                return;
              }
              if (result.id !== taskId) {
                this.taskDoc = this.afs
                  .collection('tasks')
                  .doc<Task>(result.id);
                this.timeAllocated = result.timeAllocated;
                window.localStorage.clear();
                return;
              }
              const timeAllocated =
                Number(window.localStorage.getItem('timeAllocated')) ||
                result.timeAllocated;
              if (window.localStorage.getItem('timerRunning') === 'true') {
                const timeOnLeave = Number(
                  window.localStorage.getItem('timeOnLeave')
                );
                const timeNeededToSubtract = Math.floor(
                  (Date.now() - timeOnLeave) / 1000
                );
                this.timeAllocated = timeAllocated - timeNeededToSubtract;
                this.timerRunning = true;
                this.stopTimer$.next();
                this.startTimer();
              } else {
                this.timeAllocated = timeAllocated;
              }
              window.localStorage.clear();
            })
          );
        }),
        tap((result) => {
          this.taskDetails = result;
          if (result) {
            this.taskDoc = this.afs.collection('tasks').doc<Task>(result.id);
            if (!this.timeAllocated) {
              this.timeAllocated = result.timeAllocated;
            }
          }
        })
      )
      .subscribe(() => (this.isLoading = false));
  }

  ngOnDestroy() {
    this.forceUpdateSub.unsubscribe();
  }

  startTimer() {
    this.timerRunning = true;
    timer(200, 1000)
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
    this.taskService.updateTime(this.timeAllocated, this.taskDoc);
    this.stopTimer$.next();
  }

  completeTask(taskId: string, dateOfTask: Date) {
    this.taskService
      .completeTask(taskId, dateOfTask)
      .pipe(
        tap(() => {
          this.taskService.taskDetails$.next(this.taskDetails);
          this.taskDetails = null;
          this.router.navigate(['/tasks', 'complete']);
        })
      )
      .subscribe();
  }
}
