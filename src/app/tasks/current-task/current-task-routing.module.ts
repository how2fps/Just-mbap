import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaveTimeGuard } from 'src/app/guards/save-time.guard';
import { CurrentTaskPage } from './current-task.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentTaskPage,
    canDeactivate: [SaveTimeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentTaskPageRoutingModule {}
