import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./auth/signup/signup.module').then((m) => m.SignUpPageModule),
  },
  {
    path: 'forgot',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
  {
    path: 'editprofile',
    loadChildren: () =>
      import('./users/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./tasks/task-form/task-form.module').then(
        (m) => m.TaskFormPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
  {
    path: 'complete',
    loadChildren: () =>
      import('./tasks/task-complete/task-complete.module').then(
        (m) => m.TaskCompletePageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
  {
    path: 'task-details/:id',
    loadChildren: () =>
      import('./tasks/task-details/task-details.module').then(
        (m) => m.TaskDetailsPageModule
      ),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['login']) },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
