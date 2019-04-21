import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'post'
})
export class PostPipe implements PipeTransform {

  transform(value: string, defaultString?: string): any {
    return (value) ? value : defaultString;
  }

}
