import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number): string {
    let seconds = value.toString();
    let minutes = Math.floor(Number(seconds) / 60).toString();
    let hours;

    if (Number(minutes) > 59) {
      hours = Math.floor(Number(minutes) / 60);
      hours = hours >= 10 ? hours : '0' + hours;
      minutes = (Number(minutes) - hours * 60).toString();
      minutes = Number(minutes) >= 10 ? minutes : '0' + minutes;
    }

    seconds = Math.floor(Number(seconds) % 60).toString();
    seconds = Number(seconds) >= 10 ? seconds : '0' + seconds;

    if (!hours) {
      hours = '00';
    }
    if (!minutes) {
      minutes = '00';
    }
    if (!seconds) {
      seconds = '00';
    }

    return hours + ':' + minutes + ':' + seconds;
  }
}
