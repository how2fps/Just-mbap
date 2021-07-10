import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignUpPage implements OnInit {
  signUpForm: FormGroup;
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
    this.signUpForm = new FormGroup({
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
      console.log(this.signUpForm.value);
      const email = this.signUpForm.value.email;
      const password = this.signUpForm.value.password;
      this.authService
        .signUp(email, password)
        .then(() => {
          loader.dismiss();
          this.router.navigate(['tasks', 'all']);
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
