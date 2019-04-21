import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from './upload/upload.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    AngularFireStorageModule
  ],
  providers: [
    UploadService
  ]
})
export class ProvidersModule { }
