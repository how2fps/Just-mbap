import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'tasks/all',
    loadChildren: () =>
      import('./tasks/all-tasks/all-tasks.module').then(
        (m) => m.AllTasksPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
  {
    path: 'friends',
    loadChildren: () =>
      import('./friends/friends.module').then((m) => m.FriendsPageModule),
  },
  {
    path: 'tasks/current',
    loadChildren: () =>
      import('./tasks/current-task/current-task.module').then(
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
    redirectTo: 'tasks/all',
    pathMatch: 'full',
  },
  {
    path: 'tasks/create',
    loadChildren: () =>
      import('./tasks/task-form/task-form.module').then(
        (m) => m.TaskFormPageModule
      ),
  },
  {
    path: 'task-details/:id',
    loadChildren: () =>
      import('./tasks/task-details/task-details.module').then(
        (m) => m.TaskDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
