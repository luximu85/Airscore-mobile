import {PointModel} from './point.model';

export class CylinderModel extends PointModel {
  radius: number;

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
  }
}
