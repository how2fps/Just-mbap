import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskCompletePageRoutingModule } from './task-complete-routing.module';

import { TaskCompletePage } from './task-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCompletePageRoutingModule
  ],
  declarations: [TaskCompletePage]
})
export class TaskCompletePageModule {}
