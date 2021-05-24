import {CoordinatedModel} from "../coordinates/coordinated.model";
import {TurnpointEnum, TurnpointType} from "@shared/type/task.type";

export interface IWaypointModel {
  cod: string;
  desc: string;
  lat: CoordinatedModel;
  lng: CoordinatedModel;
  altitude: number;
}

export class WaypointModel implements IWaypointModel {
  cod: string;
  desc: string;
  lat: CoordinatedModel;
  lng: CoordinatedModel;
  altitude: number;

  constructor(cod: string, desc: string, lat: CoordinatedModel, lng: CoordinatedModel, altitude: number) {
    this.cod = cod;
    this.desc = desc;
    this.lat = lat;
    this.lng = lng;
    this.altitude = altitude;
  }
}

export class WaypointGroupModel {
  name: string;
  version: string;
  waypoints: Array<WaypointModel>;

  constructor(name: string, version: string, waypoints: Array<WaypointModel>) {
    this.name = name;
    this.version = version;
    this.waypoints = waypoints;
  }
}

export class WaypointManage extends WaypointModel {

  private _active: boolean = false;
  private _state: TurnpointType = TurnpointEnum.CYLINDER;

  constructor(waypoint: WaypointModel, isSelected: boolean = false) {
    super(waypoint.cod, waypoint.desc, waypoint.lat, waypoint.lng, waypoint.altitude);
    this.active = isSelected;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get state(): TurnpointType {
    return this._state;
  }

  set state(value: TurnpointType) {
    this._state = value;
  }

}
