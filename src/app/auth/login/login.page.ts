import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  subscription: Subscription;
  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      this.authService
        .login(this.loginForm.value)
        .then(() => {
          this.loginForm.reset();
          loader.dismiss();
          this.router.navigate(['']);
        })
        .catch((err) => {
          loader.dismiss();
          this.toastController
            .create({
              message: err.message,
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
    });
  }

  loginWithGoogle() {
    let loading: HTMLIonLoadingElement;
    this.loadingController
      .create()
      .then((loader) => {
        loading = loader;
        loading.present();
        this.authService.loginWithGoogle();
      })
      .then(() => loading.dismiss());
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot']);
  }
}
