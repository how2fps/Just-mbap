import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { map, switchMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {
  taskForm: FormGroup;
  taskDocId: string;
  currentTask: boolean;
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap
      .pipe(
        map((paramMap) => {
          this.taskDocId = paramMap.get('id');
          return paramMap.get('id');
        }),
        switchMap((id) => this.taskService.getTaskDetails(id)),
        tap((taskDetails) => {
          this.currentTask = taskDetails.currentTask;
          const date = (taskDetails.date as any).toDate();
          let day = date.getDate();
          let month = date.getMonth() + 1;
          const year = date.getFullYear();
          if (month < 10) {
            month = '0' + month;
          }
          if (day < 10) {
            day = '0' + day;
          }
          const updatedDate = year + '-' + month + '-' + day;
          const timeAllocated = taskDetails.timeAllocated;
          const hours = Math.floor(timeAllocated / 3600);
          const timeLeftAfterHours = timeAllocated % 3600;
          const minutes = Math.floor(timeLeftAfterHours / 60);
          const seconds = timeLeftAfterHours % 60;

          this.taskForm.controls.title.setValue(taskDetails.title);
          this.taskForm.controls.date.setValue(updatedDate);
          this.taskForm.controls.h.setValue(hours);
          this.taskForm.controls.m.setValue(minutes);
          this.taskForm.controls.s.setValue(seconds);
          this.taskForm.controls.description.setValue(taskDetails.description);
          this.taskForm.controls.visibleToFriends.setValue(
            taskDetails.visibleToFriends
          );
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
        const updatedTask: Task = {
          title: formValues.title,
          timeAllocated: timeAllocatedInSeconds,
          date,
          description: formValues.description,
          visibleToFriends: formValues.visibleToFriends,
          currentTask: this.currentTask,
        };
        return this.taskService.editTask(this.taskDocId, updatedTask, this.currentTask);
      })
      .then(() => {
        this.router.navigate(['']);
        loaderElement.dismiss();
        this.toastController
          .create({
            message: 'Task updated.',
            duration: 2000,
          })
          .then((toast) => toast.present());
      });
  }
}
