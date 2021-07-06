import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
  taskDetails$: Observable<Task>;
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskDetails$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      switchMap((id) => this.taskService.getTaskDetails(id)),
      tap((result) => console.log(result))
    );
  }
}
