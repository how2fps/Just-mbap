import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      const email = this.forgotPasswordForm.value.email;
      this.forgotPasswordForm.reset();
      this.authService
        .forgotPassword(email)
        .then(() => {
          this.toastController
            .create({
              message: 'Reset password email has been sent to ' + email + '.',
              duration: 2000,
            })
            .then((toast) => toast.present());
          loader.dismiss();
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
