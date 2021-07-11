import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userId: string;
  editProfileForm: FormGroup;
  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.userService
      .getUserDetailsOnce$()
      .pipe(
        tap((userDetails) => {
          this.userId = userDetails.id;
          this.editProfileForm.controls.displayName.setValue(
            userDetails.displayName
          );
          this.editProfileForm.controls.status.setValue(userDetails.status);
        })
      )
      .subscribe();
  }

  initForm() {
    this.editProfileForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      status: new FormControl(''),
    });
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      const updatedDisplayName =
        this.editProfileForm.controls.displayName.value;
      const updatedStatus = this.editProfileForm.controls.status.value;
      loader.present();
      this.userService
        .updateNameAndStatus(this.userId, updatedDisplayName, updatedStatus)
        .then(() => {
          this.editProfileForm.reset();
          loader.dismiss();
          this.router.navigate(['/tabs', 'profile']);
          this.toastController
            .create({
              message: 'Details successfully edited.',
              duration: 2000,
            })
            .then((toast) => toast.present());
        })
        .catch((err) => {
          loader.dismiss();
          this.toastController
            .create({
              message: err.message,
              duration: 2000,
            })
            .then((toast) => toast.present());
        });
    });
  }
}
