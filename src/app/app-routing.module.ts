import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tasks/all',
    loadChildren: () =>
      import('./all-tasks/all-tasks.module').then((m) => m.AllTasksPageModule),
  },
  {
    path: 'friends',
    loadChildren: () =>
      import('./friends/friends.module').then((m) => m.FriendsPageModule),
  },
  {
    path: 'tasks/current',
    loadChildren: () =>
      import('./current-task/current-task.module').then(
        (m) => m.CurrentTaskPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
