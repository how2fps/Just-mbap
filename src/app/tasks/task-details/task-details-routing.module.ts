import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskDetailsPage } from './task-details.page';
import { SaveTimeGuard } from 'src/app/guards/save-time.guard';

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
