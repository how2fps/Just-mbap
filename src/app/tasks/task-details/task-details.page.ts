import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
  taskDetails: Task;
  taskDoc: AngularFirestoreDocument<Task>;
  timerRunning = false;
  stopTimer$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id) => this.taskService.getTaskDetails(id)),
        tap((result) => {
          if (result.currentTask === true) {
            return this.router.navigate(['tasks', 'current']);
          }
          this.taskDetails = result;
          this.taskDoc = this.afs.collection('tasks').doc<Task>(result.id);
        })
      )
      .subscribe();
  }

  setCurrentTask() {
    this.taskService.updateTaskToCurrent(this.taskDetails.id).subscribe(() => {
      this.router.navigate(['/tasks', 'current']);
    });
    this.taskService.forceUpdate$.next(this.taskDetails.id);
  }
}
