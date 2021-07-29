import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { combineLatest, Observable, of } from 'rxjs';
import {
  tap,
  finalize,
  catchError,
  map,
  switchMap,
  startWith,
} from 'rxjs/operators';
import { UserService } from '../user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userId: string;
  editProfileForm: FormGroup;
  base64Image: string;
  downloadURL: Observable<string>;
  initialPictureURL: Observable<any>;

  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private camera: Camera,
    private storage: AngularFireStorage,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.initForm();
    this.initialPictureURL = this.userService.getUserDetailsOnce$().pipe(
      tap((userDetails) => {
        this.userId = userDetails.id;
        this.editProfileForm.controls.displayName.setValue(
          userDetails.displayName
        );
        this.editProfileForm.controls.status.setValue(userDetails.status);
      }),
      map((userDetails) => userDetails.id),
      switchMap((userId) => {
        const ref = this.storage.ref('Images/' + userId);
        return ref.getDownloadURL();
      }),
      map((res) => ({ res, loading: false })),
      startWith({ res: undefined, loading: true }),
      catchError(() => of({ res: null, loading: false }))
    );
  }
  async changeProfilePictureActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change profile picture through: ',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => this.takeProfilePicture(1),
        },
        {
          text: 'Album',
          icon: 'image-outline',
          handler: () => this.takeProfilePicture(0),
        },
        { text: 'Cancel', role: 'cancel', icon: 'close' },
      ],
    });
    actionSheet.present();
  }

  initForm() {
    this.editProfileForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      status: new FormControl(''),
    });
  }
  takeProfilePicture(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType,
    };
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    });
  }
  savePicture() {
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${this.userId}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`Images/${this.userId}`, file);
    return task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe();
      })
    );
  }
  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  onSubmit() {
    this.loadingController.create().then((loader) => {
      const updatedDisplayName =
        this.editProfileForm.controls.displayName.value;
      const updatedStatus = this.editProfileForm.controls.status.value;
      loader.present();
      let savePictureFunction: Observable<UploadTaskSnapshot | null>;
      if (this.base64Image) {
        savePictureFunction = this.savePicture();
      } else {
        savePictureFunction = of(null);
      }
      combineLatest([
        savePictureFunction,
        this.userService.updateNameAndStatus(
          this.userId,
          updatedDisplayName,
          updatedStatus
        ),
      ])
        .pipe(
          tap(() => {
            this.editProfileForm.reset();
            loader.dismiss();
            this.router.navigate(['/tabs', 'profile']);
            this.toastController
              .create({
                message: 'Details successfully edited.',
                duration: 2000,
              })
              .then((toast) => toast.present());
          }),
          catchError((err) => {
            loader.dismiss();
            this.toastController
              .create({
                message: err.message,
                duration: 2000,
              })
              .then((toast) => toast.present());
            return of(null);
          })
        )
        .subscribe();
    });
  }
}
