/**
 * Model che rappresenta le coordinate in deg di un punto
 */
export class LatLngModel {
  private _lat: number;
  private _lng: number;

  constructor(lat: number, lng: number) {
    this._lat = lat;
    this._lng = lng;
  }


  get lat(): number {
    return this._lat;
  }

  set lat(value: number) {
    this._lat = value;
  }

  get lng(): number {
    return this._lng;
  }

  set lng(value: number) {
    this._lng = value;
  }

  public toCoordinateLngLat(): Array<number> {
    return [this._lng, this._lat];
  }
}
