import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostData } from '../../models/post.model';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, PartialObserver } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  percent: Observable<number>;
  public AllPostsCreated: PostData[] = [];
  public LastPost: string;
  public CanScrollInfinity: boolean = true;
  itemRef: AngularFireObject<PostData>;
  constructor(private storage: AngularFireStorage,
              private _loader: LoadingController,
              private _toast: ToastController,
              private _db: AngularFireDatabase) {
                // Arrancamos el loader de posts
                this.GetLastPost().subscribe(
                  (observer: PartialObserver<any> | any): void => {
                     this.AllPostsCreated.push(observer[0]);
                     this.LastPost = observer[0].key;
                     // Volvemos a cargar mas imagenes
                     this.GetTreeLastPosts(this.LastPost).subscribe(
                       (moreItems: PartialObserver<any> | any): void => {
                         this.CanScrollInfinity = moreItems;
                         console.log(moreItems);
                       }
                     );
                  }
                );
              }

  uploadFile(filePost: PostData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.presentLoading('Cargando...');
      const storageRef = this.storage.storage.ref();
      const filename: string = new Date().valueOf().toString();
      const upload: firebase.storage.UploadTask = storageRef.child(`img/${filename}`)
      .putString(filePost.img, 'base64', {
        contentType: 'image/jpeg'
      });
      upload.on(firebase.storage.TaskEvent.STATE_CHANGED, (value) => {
        console.log(value);
      },
      (error: any) => {
        // Error
        this.dismissLoader();
        this.createToast('No pudo cargar la imagen', 'danger');
        console.log(JSON.stringify(error));
        reject(null);
      }, async () => {
        // Done
        // Debemos sacar la URL de descarga
        upload.snapshot.ref.getDownloadURL().then(
          async (URL: any) => {
            const objectPost: PostData = new PostData(
              URL,
              filePost.titulo,
              filename);
           const insertDB = await this.InsertPostOnDataBase(objectPost);
           if (insertDB) {
             this.dismissLoader();
             this.createToast('Post cargado con éxito', 'success');
             resolve(true);
           } else {
             this.dismissLoader();
             this.createToast('Fallo al realizar esta operación', 'danger');
             reject(false);
           }
          },
          (err: any) => {
            console.log('Cannot get URL for the image ' + JSON.stringify(err));
            this.createToast('No se pudo obtener el link de descarga', 'danger');
            this.dismissLoader();
            reject(null);
          }
        );
        // console.log('URL para descargar ' + upload.snapshot.ref.getDownloadURL());
      });
    });
  }
  async presentLoading(msg: string) {
    const loading = await this._loader.create({
      message: msg,
    });
    await loading.present();
  }
  dismissLoader() {
    this._loader.dismiss();
  }
  async createToast(msg: string, colour: string) {
    const toast = await this._toast.create(
      {
        duration: 3000,
        message: msg,
        color: colour
      }
    );
    toast.present();
  }
  // Crear registro en la db
  InsertPostOnDataBase(post: PostData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('El post es ' + JSON.stringify(post));
      this._db.object(`/post/${post.key}`).update(post)
      .then(
        (_ => {
          resolve(true);
        }),
        (err: any) => {
          this.createToast('Operación fallida', 'danger');
          throw new Error(JSON.stringify(err));
        }
      );
    });
  }
  // Devolver siempre el ultimo registro
  GetLastPost() {
    return this._db.list('post', ref => ref.orderByKey().limitToLast(1))
    .valueChanges().pipe(
      map((objectPost: any) => {
        return objectPost;
      }),
    );
  }
  GetTreeLastPosts(actualKey: string) {
    return this._db.list('post', ref =>
                         ref.orderByKey()
                         .limitToLast(3)
                         .endAt(this.LastPost)
    ).valueChanges().pipe(
      map((objectPosts: any) => {
        console.log(objectPosts);
        if (objectPosts.length === 0 && objectPosts !== '' && objectPosts !== undefined) {
          console.log('No hay mas registros');
          return false;
        }
        for (const posts of objectPosts) {
          // Desaparecemos el elemento duplicado
          if (posts.key !== actualKey) {
            this.AllPostsCreated.push(posts);
            this.LastPost = posts.key;
          }
        }
        console.log(actualKey);
        console.log(this.LastPost);
        return true;
      }),
    );
  }
}
