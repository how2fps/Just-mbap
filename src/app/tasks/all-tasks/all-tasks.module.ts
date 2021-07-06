import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllTasksPage } from './all-tasks.page';

import { AllTasksPageRoutingModule } from './all-tasks-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AllTasksPageRoutingModule,
  ],
  declarations: [AllTasksPage],
})
export class AllTasksPageModule {}
