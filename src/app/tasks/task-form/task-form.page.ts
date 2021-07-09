import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';
import { LoadingController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
})
export class TaskFormPage implements OnInit {
  taskForm: FormGroup;
  constructor(
    private taskService: TaskService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskService.currentDate$.pipe(tap(currentDate)=>{})
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
      visibleToFriends: new FormControl(false, Validators.required),
    });
  }

  onSubmit() {
    let loaderElement: HTMLIonLoadingElement;
    this.loadingController
      .create()
      .then((loader) => {
        loaderElement = loader;
        loaderElement.present();
        const formValues = this.taskForm.value;
        const timeAllocatedInSeconds =
          +formValues.h * 60 * 60 + +formValues.m * 60 + +formValues.s;
        const date: Date = new Date(formValues.date);
        date.setHours(12);
        const newTask: Task = {
          title: formValues.title,
          timeAllocated: timeAllocatedInSeconds,
          date,
          description: formValues.description,
          visibleToFriends: formValues.visibleToFriends,
          currentTask: false,
        };
        return this.taskService.createTask(newTask);
      })
      .then(() => {
        this.router.navigate(['/tasks', 'all']);
        loaderElement.dismiss();
      });
  }
}
