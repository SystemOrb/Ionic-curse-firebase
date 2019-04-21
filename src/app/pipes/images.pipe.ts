import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'images'
})
export class ImagesPipe implements PipeTransform {

  transform(value: string, notImage: string = 'https://image.flaticon.com/icons/png/512/23/23765.png'): any {
    return (value) ? value : notImage;
  }

}
