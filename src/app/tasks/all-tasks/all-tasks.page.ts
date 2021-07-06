import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: 'all-tasks.page.html',
  styleUrls: ['all-tasks.page.scss'],
})
export class AllTasksPage implements OnInit {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  tasks$: Observable<Task[]>;
  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
  }

  ngOnInit() {}
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  addEvent() {
    // let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    // modal.present();
    // modal.onDidDismiss(data => {
    //   if (data) {
    //     let eventData = data;
    //     eventData.startTime = new Date(data.startTime);
    //     eventData.endTime = new Date(data.endTime);
    //     let events = this.eventSource;
    //     events.push(eventData);
    //     this.eventSource = [];
    //     setTimeout(() => {
    //       this.eventSource = events;
    //     });
    //   }
    // });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    // let start = moment(event.startTime).format('LLLL');
    // let end = moment(event.endTime).format('LLLL');
    // let alert = this.alertCtrl.create({
    //   title: '' + event.title,
    //   subTitle: 'From: ' + start + '<br>To: ' + end,
    //   buttons: ['OK']
    // })
    // alert.present();
  }

  onTimeSelected(ev) {
    console.log('hi');
    console.log(ev);
    this.selectedDay = ev.selectedTime;
  }
}
