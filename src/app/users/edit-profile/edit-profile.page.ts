import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editProfileForm: FormGroup;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.initForm();
    this.userService
      .getUserDetailsOnce$()
      .pipe(
        tap((userDetails) => {
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

  onSubmit() {}
}
