import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsPage } from './friends.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage,
  },
  {
    path: 'add-friends',
    loadChildren: () => import('./add-friends/add-friends.module').then( m => m.AddFriendsPageModule)
  },  {
    path: 'friend-profile',
    loadChildren: () => import('./friend-profile/friend-profile.module').then( m => m.FriendProfilePageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsPageRoutingModule {}
