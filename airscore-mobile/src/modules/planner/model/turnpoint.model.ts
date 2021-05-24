import {LatLngModel} from '@shared/model/coordinates/lat-lng.model';
import {CylinderModel} from './cylinder.model';
import {Circle} from 'ol/geom';
import * as olProj from 'ol/proj';
import * as olSphere from 'ol/sphere';
import {GoalType, TurnpointType} from "@shared/type/task.type";

export class TurnpointModel extends CylinderModel {
  latLng: LatLngModel;
  type: TurnpointType;
  goalType: GoalType|undefined;

  constructor(x: number, y: number, radius: number, type: TurnpointType, goalType?: GoalType) {
    super(x, y, radius);
    this.latLng = new LatLngModel(y, x);
    this.type = type;
    this.goalType = goalType;
  }
}

export function createTurnpointFromCircle(circle: Circle, type: TurnpointType, goalType?: GoalType): TurnpointModel {
  const center = circle.getCenter();
  const radius = circle.getRadius();
  const edgeCoordinate = [center[0] + radius, center[1]];
  const radiusProjected = olSphere.getDistance(
    olProj.transform(center, 'EPSG:3857', 'EPSG:4326'),
    olProj.transform(edgeCoordinate, 'EPSG:3857', 'EPSG:4326'),
    6378137 //TODO Perchè questo raggio terrestre e non quello di default dell'oggetto plSphere
  );
  const lonlat = olProj.transform(center, 'EPSG:3857', 'EPSG:4326');
  return new TurnpointModel(lonlat[0], lonlat[1], radiusProjected, type, goalType);
}
