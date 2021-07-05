import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription;
  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.subscription = this.authService.getCurrentUser$().subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      loader.present();
      this.authService
        .login(this.loginForm.value)
        .then(() => {
          loader.dismiss();
          this.router.navigate(['tasks', 'all']);
        })
        .catch((err) => {
          loader.dismiss();
          console.log(err);
        });
    });
  }
}
