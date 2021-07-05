import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.initForm();
    this.authService.getCurrentUser$().subscribe();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value);
  }

  logout() {
    this.authService.logout();
  }
}
