import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: 'all-tasks.page.html',
  styleUrls: ['all-tasks.page.scss'],
})
export class AllTasksPage implements OnInit {
  tasks$: Observable<Task[]>;
  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }

  ngOnInit() {}
}
