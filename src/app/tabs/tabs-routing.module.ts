import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadChildren: () =>
          import('../tasks/all-tasks/all-tasks.module').then(
            (m) => m.AllTasksPageModule
          ),
      },
      {
        path: 'current',
        loadChildren: () =>
          import('../tasks/current-task/current-task.module').then(
            (m) => m.CurrentTaskPageModule
          ),
      },
      {
        path: 'friends',
        loadChildren: () =>
          import('../friends/friends.module').then((m) => m.FriendsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../users/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tasks',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
