import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllTasksPage } from './all-tasks.page';
import { TimePipe } from '../../pipes/time.pipe';

import { AllTasksPageRoutingModule } from './all-tasks-routing.module';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    NgCalendarModule,
    IonicModule,
    CommonModule,
    FormsModule,
    AllTasksPageRoutingModule,
  ],
  declarations: [AllTasksPage, TimePipe],
})
export class AllTasksPageModule {}
