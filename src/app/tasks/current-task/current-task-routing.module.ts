import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentTaskPage } from './current-task.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentTaskPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentTaskPageRoutingModule {}
