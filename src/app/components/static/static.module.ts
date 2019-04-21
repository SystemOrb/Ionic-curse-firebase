import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';
import { PostPipe } from '../../pipes/post.pipe';
import { ImagesPipe } from '../../pipes/images.pipe';

@NgModule({
  declarations: [
    UploadComponent,
    PostPipe,
    ImagesPipe
  ],
  exports: [
    UploadComponent
  ],
  entryComponents: [
    UploadComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class StaticModule { }
