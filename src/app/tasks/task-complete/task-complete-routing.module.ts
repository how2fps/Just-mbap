import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskCompletePage } from './task-complete.page';

const routes: Routes = [
  {
    path: '',
    component: TaskCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCompletePageRoutingModule {}
