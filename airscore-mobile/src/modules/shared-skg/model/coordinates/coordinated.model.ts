export enum EDirectionCoor {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
};

export class CoordinatedModel {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: EDirectionCoor;

  constructor(degrees: number, minutes: number, seconds: number, direction: EDirectionCoor) {
    this.degrees = degrees;
    this.minutes = minutes;
    this.seconds = seconds;
    this.direction = direction;
  }

  convertDMSToDD(): number {
    let dd = this.degrees + this.minutes/60 + this.seconds/(60*60);
    if (this.direction == EDirectionCoor.S || this.direction == EDirectionCoor.W) {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }
}
