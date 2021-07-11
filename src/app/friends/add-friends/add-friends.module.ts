import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFriendsPageRoutingModule } from './add-friends-routing.module';

import { AddFriendsPage } from './add-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFriendsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddFriendsPage],
})
export class AddFriendsPageModule {}
