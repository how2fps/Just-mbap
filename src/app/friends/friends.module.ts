import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends.page';

import { FriendsPageRoutingModule } from './friends-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FriendsPage }]),
    FriendsPageRoutingModule,
  ],
  declarations: [FriendsPage],
})
export class FriendsPageModule {}
