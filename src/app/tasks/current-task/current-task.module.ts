import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentTaskPage } from './current-task.page';
import { CurrentTaskPageRoutingModule } from './current-task-routing.module';
import { TimePipeModule } from 'src/app/ngModules/time-pipe-module/time-pipe.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CurrentTaskPageRoutingModule,
    TimePipeModule,
  ],
  declarations: [CurrentTaskPage],
})
export class CurrentTaskPageModule {}
