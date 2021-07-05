import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
})
export class TaskFormPage implements OnInit {
  taskForm: FormGroup;
  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.taskForm = new FormGroup({
      title: new FormControl('', Validators.required),
      h: new FormControl('', [Validators.required, Validators.max(23)]),
      m: new FormControl('', [Validators.required, Validators.max(59)]),
      s: new FormControl('', [Validators.required, Validators.max(59)]),
      date: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    const formValues = this.taskForm.value;
    const timeAllocated =
      formValues['h'].toString() +
      ':' +
      formValues['m'].toString() +
      ':' +
      formValues['s'].toString();
    const newTask: Task = {
      title: formValues['title'],
      timeAllocated: timeAllocated,
      date: formValues['date'],
      description: formValues['description'],
    };
    this.taskService.createTask(newTask).then(() => {
      this.router.navigate(['/tasks', 'all']);
    });
  }
}
