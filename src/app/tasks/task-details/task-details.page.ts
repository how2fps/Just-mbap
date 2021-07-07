import { Component, HostListener, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { now, take } from 'lodash';
import { Subject, timer } from 'rxjs';
import {
  distinctUntilChanged,
  first,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
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
  taskDoc: AngularFirestoreDocument<Task>;
  timerRunning: boolean;
  stopTimer$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private afs: AngularFirestore
  ) {}

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
    window.sessionStorage.setItem(
      'timeAllocated',
      this.timeAllocated.toString()
    );
    window.sessionStorage.setItem('taskId', this.taskDetails.id);
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id) => this.taskService.getTaskDetails(id)),
        tap((result) => {
          const taskId = window.sessionStorage.getItem('taskId');
          this.taskDetails = result;
          if (result.id === taskId) {
            this.timeAllocated = Number(
              window.sessionStorage.getItem('timeAllocated')
            );
          } else {
            this.timeAllocated = result.timeAllocated;
          }
          window.sessionStorage.clear();
          this.taskDoc = this.afs
            .collection('tasks')
            .doc<Task>(this.taskDetails.id);
        })
      )
      .subscribe();
  }

  startTimer() {
    this.timerRunning = true;
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
    console.log(this.timeAllocated);
    this.taskService.updateTime(this.timeAllocated, this.taskDoc);
    this.stopTimer$.next();
  }
}
