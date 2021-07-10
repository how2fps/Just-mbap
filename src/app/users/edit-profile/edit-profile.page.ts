import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editProfileForm: FormGroup;
  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editProfileForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      status: new FormControl(''),
    });
  }

  onSubmit() {}
}
