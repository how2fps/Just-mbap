import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendProfilePageRoutingModule } from './friend-profile-routing.module';

import { FriendProfilePage } from './friend-profile.page';
import { TimePipeModule } from 'src/app/ngModules/time-pipe-module/time-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendProfilePageRoutingModule,
    TimePipeModule,
  ],
  declarations: [FriendProfilePage],
})
export class FriendProfilePageModule {}
