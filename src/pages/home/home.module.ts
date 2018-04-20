import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { Task } from '../../providers/task';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage), 
    IonicStorageModule.forRoot()],
  providers: [Task, LocalNotifications],
})
export class HomePageModule { }