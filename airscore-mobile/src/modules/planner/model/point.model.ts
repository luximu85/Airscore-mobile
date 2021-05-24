export class PointModel {
  x: number;
  y: number;
  fx: number;
  fy: number;


  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.fx = x;
    this.fy = y;
  }
}
