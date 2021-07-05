import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  firebaseConfig = {
    apiKey: 'AIzaSyAzQsO4RVm1Q5PcYrpZjlO3hAFvrEerRSM',
    authDomain: 'just-mbap-project-part2.firebaseapp.com',
    databaseURL:
      'https://just-mbap-project-part2-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'just-mbap-project-part2',
    storageBucket: 'just-mbap-project-part2.appspot.com',
    messagingSenderId: '124548983096',
    appId: '1:124548983096:web:e93f388f9c3ba76d7eb9cd',
    measurementId: 'G-7374TN4T25',
  };
  constructor() {}

  ngOnInit() {
    firebase.initializeApp(this.firebaseConfig);
  }
}
