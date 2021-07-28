import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userDetails$: Observable<any>;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private camera: Camera
  ) {}

  ngOnInit() {
    this.userDetails$ = this.userService.getUserDetails$().pipe(
      map((res) => ({ res, loading: false })),
      startWith({ res: undefined, loading: true })
    );
  }

  goToEditDetails() {
    this.router.navigate(['/editprofile']);
  }

  logout() {
    this.authService.logout();
  }

  takeProfilePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(base64Image);
      },
      (err) => {
        // Handle error
      }
    );
  }
}
