import { Component } from '@angular/core';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { UploadComponent } from '../components/static/upload/upload.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, PartialObserver } from 'rxjs';
import { UploadService } from '../providers/upload/upload.service';
import { PostData } from '../models/post.model';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private _modal: ModalController, private _db: AngularFireDatabase,
    public _cloud: UploadService, private _share: SocialSharing) {
  }

  async triggerModal() {
    const modal = await this._modal.create({
      component: UploadComponent
    });
    return await modal.present();
  }
  loadMorePost(infinite: any): void {
    this._cloud.GetTreeLastPosts(this._cloud.LastPost).subscribe(
      (canLoadMore: any) => {
        console.log(canLoadMore);
        if (canLoadMore) {
          infinite.target.complete();
        }
      }
    );
  }
  SocialShare(post: PostData): void {
    this._share.shareViaFacebook(post.titulo, post.img, post.img).then(
      (_shared: any) => {
        this._cloud.createToast('Compartido exitosamente', 'success');
      },
      (err: any) => {
        console.log('No pudo compartir en facebook ' + JSON.stringify(err));
      }
    );
  }
}
