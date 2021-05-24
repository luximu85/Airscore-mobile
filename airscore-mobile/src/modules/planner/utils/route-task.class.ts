import {GeoCalc} from './geo-calc.class';
import {PointModel} from '../model/point.model';
import {CylinderModel} from '../model/cylinder.model';
import {TurnpointModel} from '../model/turnpoint.model';
import {LatLngModel} from '@shared/model/coordinates/lat-lng.model';

  export const INT_MAX = Number.MAX_SAFE_INTEGER;

export class RouteTask {

  //FastTrack è la polilinea della route
  // fastTrack;
  optimizedMarkers = [];
  public pointsRouteOptimized: Array<LatLngModel> = [];
  public distanceOptimized: number|undefined;
  fastDistance = 0;

  routeOptimizeTask(turnpoints: Array<TurnpointModel>) {

    // checkStartDirection(turnpoints);

    let zone = "33"; // just default if not valid turnpoits yet
    if (turnpoints.length > 0) {
      zone = String(GeoCalc.getUtmZoneFromPosition(turnpoints[0].latLng.lng, turnpoints[0].latLng.lat));
    }

    let es = turnpoints.length - 1;
    let ss = 1;
    let g = turnpoints.length - 1;
    for (let i = 0; i < turnpoints.length; i++) {
      if (turnpoints[i].type == 'ess') {
        es = i;
      }
      if (turnpoints[i].type == 'sss') {
        ss = i;
      }
      if (turnpoints[i].type == 'goal') {
        g = i;
      }
    }

    let points: Array<CylinderModel> = [];
    for (let i = 0; i < turnpoints.length; i++) {
      const p = GeoCalc.degrees2utm(turnpoints[i].latLng.lng, turnpoints[i].latLng.lat, zone);
      points.push(this.createCylinder(p[0], p[1], turnpoints[i].radius))
    }

    let goalLine: Array<PointModel> = [];
    if (g > 0 && turnpoints[g].type == 'goal' && turnpoints[g].goalType == 'line') {
      let i = g - 1;
      let pastTurnpoint = turnpoints[g - 1];
      while (i > 0 && pastTurnpoint.latLng == turnpoints[g].latLng) {
        i--;
        pastTurnpoint = turnpoints[i];
      }

      //var lastLegHeading = google.maps.geometry.spherical.computeHeading(pastTurnpoint.latLng, turnpoints[g].latLng);
      let lastLegHeading = GeoCalc.computeHeading(pastTurnpoint.latLng, turnpoints[g].latLng);
      if (lastLegHeading < 0) lastLegHeading += 360;
      // Add 90° to this heading to have a perpendicular.
      let heading = lastLegHeading + 90;
      // Getting a first point 50m further.
      // var firstPoint = google.maps.geometry.spherical.computeOffset(turnpoints[g].latLng, turnpoints[g].radius, heading);
      let firstPoint = GeoCalc.computeOffset(turnpoints[g].latLng, turnpoints[g].radius, heading);

      // Reversing the heading.
      heading += 180;
      // And now completing the line with a point 100m further.
      // var secondPoint = google.maps.geometry.spherical.computeOffset(firstPoint, 2 * turnpoints[g].radius, heading);
      let secondPoint = GeoCalc.computeOffset(firstPoint, 2 * turnpoints[g].radius, heading);

      const p1 = GeoCalc.degrees2utm(firstPoint.lng, firstPoint.lat, zone);
      const p2 = GeoCalc.degrees2utm(secondPoint.lng, secondPoint.lat, zone);

      // goalLine.push({ x: p1[0], y: p1[1] });
      // goalLine.push({ x: p2[0], y: p2[1] });
      goalLine.push(this.createPoint(p1[0], p1[1]));
      goalLine.push(this.createPoint(p2[0], p2[1]));
    }

    this.distanceOptimized = this.getShortestPath(points, es, goalLine);
    // console.log("Distance : " + this.distanceOptimized);

    this.pointsRouteOptimized = [];
    for (let i = 0; i < turnpoints.length; i++) {
      const fl = GeoCalc.utm2degress(points[i].fx, points[i].fy, zone);
      this.pointsRouteOptimized.push(new LatLngModel(fl[1], fl[0]))
      // this.fastWaypoints.push(new google.maps.LatLng(fl[1], fl[0]))
    }
    console.log("Route Polyline: ", this.pointsRouteOptimized);
    //
    //
    //
    //
    // var lineSymbol = {
    //   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    // };
    //
    //
    //
    //
    // if (fastTrack) fastTrack.setMap(null);
    // fastTrack = new google.maps.Polyline({
    //   path: fastWaypoints,//.slice(0, -1),
    //   geodesic: true,
    //   strokeColor: param.task.courseColor.fast,
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2,
    //   icons: [{
    //     icon: lineSymbol,
    //     offset: '0',
    //     repeat: '100px'
    //   }],
    //   map: map,
    // });
    //
    //
    //
    //
    // var markerImageSS = {
    //   url: "images/markers/PNG/Centered/32x32/icon26.png", // url
    //   scaledSize: new google.maps.Size(16, 16), // scaled size
    //   origin: new google.maps.Point(0, 0), // origin
    //   anchor: new google.maps.Point(8, 8) // anchor
    // };
    //
    // var markerImage = {
    //   url: "images/markers/PNG/Centered/32x32/placemark_circle.png", // url
    //   scaledSize: new google.maps.Size(16, 16), // scaled size
    //   origin: new google.maps.Point(0, 0), // origin
    //   anchor: new google.maps.Point(8, 8) // anchor
    // };
    //
    // var markerImageES = {
    //   url: "images/markers/PNG/Centered/32x32/icon60.png", // url
    //   scaledSize: new google.maps.Size(16, 16), // scaled size
    //   origin: new google.maps.Point(0, 0), // origin
    //   anchor: new google.maps.Point(8, 8) // anchor
    // };
    //
    //
    // for (var i = 0; i < 100; i++) {
    //   if (optimizedMarkers[i]) optimizedMarkers[i].setMap(null);
    // }
    //
    // for (var i = 0; i < fastWaypoints.length; i++) {
    //   optimizedMarkers[i] = new google.maps.Marker({
    //     scaledSize: new google.maps.Size(8, 8), // scaled size
    //     position: fastWaypoints[i],
    //     map: map,
    //     icon: i == ss ? markerImageSS : i == es ? markerImageES : markerImage,
    //   });
    // }
    //
    //
    // recalcDistance(google, fastWaypoints, turnpoints[0] != undefined ? turnpoints[0].radius : 0);



  }

  createPoint(x: number, y: number): PointModel {
    return new PointModel(x, y);
  }

  createCylinder(x: number, y: number, radius: number = 0): CylinderModel {
    return new CylinderModel(x, y, radius);
  }

  createCylinderFromCenter(point: CylinderModel): CylinderModel {
    return this.createCylinder(point.x, point.y, point.radius)
  }

  createCylinderFromFix(point: CylinderModel): CylinderModel {
    return this.createCylinder(point.fx, point.fy, point.radius)
  }


  // Inputs:
  // points - array of point objects
  // esIndex - index of the ESS point, or -1
  // line - goal line endpoints, or empty array
  getShortestPath(points: Array<CylinderModel>, esIndex: number, line: Array<PointModel>) {
    const tolerance = 1.0;
    let lastDistance = INT_MAX;
    let finished = false;
    const count: number = (points.length);
    // opsCount is the number of operations allowed
    let opsCount = count * 10;
    while (!finished && opsCount-- > 0) {
      const distance = this.optimizePath(points, count, esIndex, line);
      // See if the difference between the last distance id
      // smaller than the tolerance
      finished = lastDistance - distance < tolerance;
      lastDistance = distance;
    }
    return lastDistance;
  }

  // Inputs:
  // points - array of point objects
  // count - number of points
  // esIndex - index of the ESS point, or -1
  // line - goal line endpoints, or empty array
  optimizePath(points: Array<CylinderModel>, count: number, esIndex: number, line: Array<PointModel>) {
    let distance = 0;
    const hasLine = (line.length) == 2;
    for (let index = 1; index < count; index++) {
      // Get the target cylinder c and its preceding and succeeding points
      let a, b, c;
      let ret = this.getTargetPoints(points, count, index, esIndex);
      c = ret[0];
      a = ret[1];
      b = ret[2];
      if (index == count - 1 && hasLine) {
        this.processLine(line, c, a);
      } else {
        this.processCylinder(c, a, b);
      }
      // Calculate the distance from A to the C fix point
      let legDistance = Math.hypot(a.x - c.fx, a.y - c.fy);
      distance += legDistance;
    }
    return distance;
  }

  // Inputs:
  // points - array of point objects
  // count - number of points
  // index - index of the target cylinder (from 1 upwards)
  // esIndex - index of the ESS point, or -1
  getTargetPoints(points: Array<CylinderModel>, count: number, index: number, esIndex: number): Array<CylinderModel> {
    // Set point C to the target cylinder
    const c = points[index];
    // Create point A using the fix from the previous point
    const a = this.createCylinderFromFix(points[index - 1]);
    // Create point B using the fix from the next point
    // (use point C center for the lastPoint and esIndex).
    let b;
    if (index == count - 1 || index == esIndex) {
      b = this.createCylinderFromCenter(c);
    } else {
      b = this.createCylinderFromFix(points[index + 1]);
    }
    return [c, a, b];
  }

  // Inputs:
  // line - array of goal line endpoints
  // c, a - target (goal), previous point
  processLine(line: Array<PointModel>, c: PointModel, a: PointModel) {
    let g1 = line[0];
    let g2 = line[1];
    const len2 = (g1.x - g2.x) ** 2 + (g1.y - g2.y) ** 2;
    if (len2 == 0.0) {
      // Error trapping: g1 and g2 are the same point
      c.fx = g1.x;
      c.fy = g1.y;
    } else {
      const t = ((a.x - g1.x) * (g2.x - g1.x) + (a.y - g1.y) * (g2.y - g1.y)) / len2;
      if (t < 0.0) {
        // Beyond the g1 end of the line segment
        c.fx = g1.x;
        c.fy = g1.y;
      } else if (t > 1.0) {
        // Beyond the g2 end of the line segment
        c.fx = g2.x;
        c.fy = g2.y;
      } else {
        // Projection falls on the line segment
        c.fx = t * (g2.x - g1.x) + g1.x;
        c.fy = t * (g2.y - g1.y) + g1.y;
      }
    }
  }

  // Inputs:
  // c, a, b - target cylinder, previous point, next point
  processCylinder(c: CylinderModel, a: CylinderModel, b: CylinderModel) {
    var distAC, distBC, distAB, distCtoAB;
    var ret = this.getRelativeDistances(c, a, b);
    distAC = ret[0];
    distBC = ret[1];
    distAB = ret[2];
    distCtoAB = ret[3];
    if (distAB == 0.0) {
      // A and B are the same point: project the point on the circle
      this.projectOnCircle(c, a.x, a.y, distAC);
    } else if (this.pointOnCircle(c, a, b, distAC, distBC, distAB, distCtoAB)) {
      // A or B are on the circle: the fix has been calculated
      return;
    } else if (distCtoAB < c.radius) {
      // AB segment intersects the circle, but is not tangent to it
      if (distAC < c.radius && distBC < c.radius) {
        // A and B are inside the circle
        this.setReflection(c, a, b);
      } else if (distAC < c.radius && distBC > c.radius ||
        (distAC > c.radius && distBC < c.radius)) {
        // One point inside, one point outside the circle
        this.setIntersection1(c, a, b, distAB);
      } else if (distAC > c.radius && distBC > c.radius) {
        // A and B are outside the circle
        this.setIntersection2(c, a, b, distAB);
      }
    } else {
      // A and B are outside the circle and the AB segment is
      // either tangent to it or or does not intersect it
      this.setReflection(c, a, b);
    }
  }

  // Inputs:
  // c, a, b - target cylinder, previous point, next point
  getRelativeDistances(c: CylinderModel, a: CylinderModel, b: CylinderModel): Array<number> {
    // Calculate distances AC, BC and AB
    const distAC = Math.hypot(a.x - c.x, a.y - c.y);
    const distBC = Math.hypot(b.x - c.x, b.y - c.y);
    const len2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    const distAB = Math.sqrt(len2);
    // Find the shortest distance from C to the AB line segment
    let distCtoAB;
    if (len2 == 0.0) {
      // A and B are the same point
      distCtoAB = distAC;
    } else {
      const t = ((c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y)) / len2;
      if (t < 0.0) {
        // Beyond the A end of the AB segment
        distCtoAB = distAC;
      } else if (t > 1.0) {
        // Beyond the B end of the AB segment
        distCtoAB = distBC;
      } else {
        // On the AB segment
        const cpx = t * (b.x - a.x) + a.x;
        const cpy = t * (b.y - a.y) + a.y;
        distCtoAB = Math.hypot(cpx - c.x, cpy - c.y);
      }
    }
    return [distAC, distBC, distAB, distCtoAB];
  }

  // Inputs:
  // c - the circle
  // x, y - coordinates of the point to project
  // len - line segment length, from c to the point
  projectOnCircle(c: CylinderModel, x: number, y: number, len: number): void {
    if (len == 0.0) {
      // The default direction is eastwards (90 degrees)
      c.fx = c.radius + c.x;
      c.fy = c.y;
    } else {
      c.fx = c.radius * (x - c.x) / len + c.x;
      c.fy = c.radius * (y - c.y) / len + c.y;
    }
  }

  // Inputs:
  // c, a, b - target cylinder, previous point, next point
  // Distances between the points
  pointOnCircle(c: CylinderModel, a: CylinderModel, b: CylinderModel,
                       distAC: number, distBC: number, distAB: number, distCtoAB: number): boolean {
    if (Math.abs(distAC - c.radius) < 0.0001) {
      // A on the circle (perhaps B as well): use A position
      c.fx = a.x;
      c.fy = a.y;
      return true;
    }
    if (Math.abs(distBC - c.radius) < 0.0001) {
      // B on the circle
      if (distCtoAB < c.radius && distAC > c.radius) {
        // AB segment intersects the circle and A is outside it
        this.setIntersection2(c, a, b, distAB);
      } else {
        // Use B position
        c.fx = b.x;
        c.fy = b.y;
      }
      return true;
    }
    return false;
  }

  // Inputs:
  // c, a, b - target cylinder, previous point, next point
  // distAB - AB line segment length
  setIntersection1(c: CylinderModel, a: CylinderModel, b: CylinderModel, distAB: number): void {
    // Get the intersection points (s1, s2)
    const ret = this.getIntersectionPoints(c, a, b, distAB);
    const s1 = ret[0];
    const s2 = ret[1];
    const e = ret[2];
    const as1 = Math.hypot(a.x - s1.x, a.y - s1.y);
    const bs1 = Math.hypot(b.x - s1.x, b.y - s1.y);
    // Find the intersection lying between points a and b
    if (Math.abs(as1 + bs1 - distAB) < 0.0001) {
      c.fx = s1.x;
      c.fy = s1.y;
    } else {
      c.fx = s2.x;
      c.fy = s2.y;
    }
  }

  // Inputs:
  // c, a, b - target cylinder, previous point, next point
  // distAB - AB line segment length
  setIntersection2(c: CylinderModel, a: CylinderModel, b: CylinderModel, distAB: number): void {
    // Get the intersection points (s1, s2) and midpoint (e)
    const ret = this.getIntersectionPoints(c, a, b, distAB);
    const s1 = ret[0];
    const s2 = ret[1];
    const e = ret[2];
    const as1 = Math.hypot(a.x - s1.x, a.y - s1.y);
    const es1 = Math.hypot(e.x - s1.x, e.y - s1.y);
    const ae = Math.hypot(a.x - e.x, a.y - e.y);
    // Find the intersection between points a and e
    if (Math.abs(as1 + es1 - ae) < 0.0001) {
      c.fx = s1.x;
      c.fy = s1.y;
    } else {
      c.fx = s2.x;
      c.fy = s2.y;
    }
  }

  // Inputs:
  // c, a, b - target cylinder, previous point, next point
  // distAB - AB line segment length
  getIntersectionPoints(c: CylinderModel, a: CylinderModel, b: CylinderModel, distAB: number): Array<PointModel> {
    // Find e, which is on the AB line perpendicular to c center
    const dx = (b.x - a.x) / distAB;
    const dy = (b.y - a.y) / distAB;
    const t2 = dx * (c.x - a.x) + dy * (c.y - a.y);
    const ex = t2 * dx + a.x;
    const ey = t2 * dy + a.y;
    // Calculate the intersection points, s1 and s2
    const dt2 = c.radius ** 2 - (ex - c.x) ** 2 - (ey - c.y) ** 2;
    const dt = dt2 > 0 ? Math.sqrt(dt2) : 0;
    const s1x = (t2 - dt) * dx + a.x;
    const s1y = (t2 - dt) * dy + a.y;
    const s2x = (t2 + dt) * dx + a.x;
    const s2y = (t2 + dt) * dy + a.y;
    return [
      this.createPoint(s1x, s1y),
      this.createPoint(s2x, s2y),
      this.createPoint(ex, ey)
    ];
  }

  // Inputs:
  // c, a, b - target circle, previous point, next point
  setReflection(c: CylinderModel, a: CylinderModel, b: CylinderModel): void {
    // The lengths of the adjacent triangle sides (af, bf) are
    // proportional to the lengths of the cut AB segments (ak, bk)
    const af = Math.hypot(a.x - c.fx, a.y - c.fy);
    const bf = Math.hypot(b.x - c.fx, b.y - c.fy);
    const t = af / (af + bf);
    // Calculate point k on the AB segment
    const kx = t * (b.x - a.x) + a.x;
    const ky = t * (b.y - a.y) + a.y;
    const kc = Math.hypot(kx - c.x, ky - c.y);
    // Project k on to the radius of c
    this.projectOnCircle(c, kx, ky, kc);
  }



}



