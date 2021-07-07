import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaveTimeGuard } from 'src/app/guards/save-time.guard';

import { TaskDetailsPage } from './task-details.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailsPage,
    canDeactivate: [SaveTimeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailsPageRoutingModule {}
