import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllTasksPage } from './all-tasks.page';

import { AllTasksPageRoutingModule } from './all-tasks-routing.module';
import { NgCalendarModule } from 'ionic2-calendar';
import { TimePipeModule } from 'src/app/ngModules/time-pipe-module/time-pipe.module';

@NgModule({
  imports: [
    NgCalendarModule,
    IonicModule,
    CommonModule,
    FormsModule,
    AllTasksPageRoutingModule,
    TimePipeModule,
  ],
  declarations: [AllTasksPage],
})
export class AllTasksPageModule {}
