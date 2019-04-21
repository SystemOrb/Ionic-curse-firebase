import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { UploadService } from '../../../providers/upload/upload.service';
import { PostData } from '../../../models/post.model';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  ImagePreview: string;
  PostName: string;
  imageBase64: string;
  constructor(private _modal: ModalController,
              private camera: Camera,
              private imagePicker: ImagePicker,
              private _fb: UploadService) { }

  ngOnInit() {}
  closeModal() {
    this._modal.dismiss();
  }

  OpenCamera(): void  {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.ImagePreview = 'data:image/jpeg;base64,' + imageData;
      this.imageBase64 = imageData;
     }, (err) => {
      throw new Error(JSON.stringify(err));
     });
  }
  OpenGallery(): void {
    const config: ImagePickerOptions = {
      quality: 50,
      maximumImagesCount: 1,
      outputType: 1
    };
    this.imagePicker.getPictures(config).then((results) => {
      for (let i = 0; i < results.length; i++) {
      this.ImagePreview = 'data:image/jpeg;base64,' + results[i];
      this.imageBase64 = results[i];
     // console.log('Image URI: ' + results[i]);
      }
    }, (err) => {
      throw new Error(JSON.stringify(err));
    });
  }
  UploadTask() {
    if (this.PostName && this.imageBase64 && this.ImagePreview) {
      const post = new PostData(this.imageBase64, this.PostName);
      this._fb.uploadFile(post).then(
          (promise: boolean): void => {
            if (promise) {
              this._fb.createToast('Post creado con éxito', 'success');
              return;
            }
          },
          (error: any): void => {
            this._fb.createToast('Fallo al crear el post', 'danger');
            throw new Error(JSON.stringify(error));
          }
      );
    }
  }
}
