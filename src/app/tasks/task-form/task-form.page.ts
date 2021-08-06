import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
})
export class TaskFormPage implements OnInit {
  taskForm: FormGroup;
  selectedDate: Date;
  constructor(
    private taskService: TaskService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.taskService.currentDate$
      .pipe(
        distinctUntilChanged(),
        tap((currentDate) => {
          this.selectedDate = currentDate;
          let date = currentDate.getUTCDate().toString();
          const year = currentDate.getFullYear().toString();
          let month = (currentDate.getUTCMonth() + 1).toString();
          if (Number(month) < 10) {
            month = '0' + month;
          }
          if (Number(date) < 10) {
            date = '0' + date;
          }
          const formattedDate = year + '-' + month + '-' + date;
          this.taskForm.controls.date.setValue(formattedDate);
        })
      )
      .subscribe();
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
    const taskDate = new Date(this.taskForm.controls.date.value).toDateString();
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
        this.router.navigate(['']);
        loaderElement.dismiss();
        this.toastController
          .create({
            message: 'Task on ' + taskDate + ' created.',
            duration: 2000,
            buttons: [
              {
                text: 'X',
                role: 'cancel',
              },
            ],
          })
          .then((toast) => toast.present());
      });
  }
}
