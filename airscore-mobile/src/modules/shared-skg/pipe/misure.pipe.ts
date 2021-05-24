import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meterToKm',
  pure: true
})
export class MetertoKmPipe implements PipeTransform {

  transform(value: number|undefined, decimalPlaces: number): number {
    if (!value) {
      return 0;
    }
    return Math.round(value/1000 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  }

}
