import {LatLngModel} from '../../shared-skg/model/coordinates/lat-lng.model';
import proj4 from 'proj4';
declare  var GeographicLib:  any;

export class GeoCalc {
  public static geod = GeographicLib.Geodesic.WGS84;

  static toRad(n: number): number {
    return n * Math.PI / 180;
  };

  static getUtmZoneFromPosition(lon: number, lat: number): number {
    return (Math.floor((lon + 180) / 6) % 60) + 1;
  };

  static degrees2meters(lon: number, lat: number): Array<number> {
    let x = lon * 20037508.34 / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return [x, y]
  }

  static meters2degress(x: number, y: number): Array<number> {
    let lon = x * 180 / 20037508.34;
    let lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return [lon, lat]
  }

  static degrees2utm(lon: number, lat: number, zone: string) {
    let utm = "+proj=utm +zone=" + zone;
    let wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    return proj4(wgs84, utm, [lon, lat]);
  }

  static utm2degress(x: number, y: number, zone: string) {
    let utm = "+proj=utm +zone=" + zone;
    let wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    return proj4(utm, wgs84, [x, y]);
  }

  static computeHeading(latLng1: any, latLng2: any) {
    return this.geod.Inverse(latLng1.lat(),latLng1.lng(), latLng2.lat(), latLng2.lng()).azi1 ;
  }


  static computeOffset(latLng1: any, radius: any, heading: any): LatLngModel {
    let gl =  new GeographicLib.GeodesicLine.GeodesicLine(this.geod,latLng1.lat(), latLng1.lng(), heading);
    let p = gl.GenPosition(false, radius);
    return new LatLngModel(p.lat2, p.lon2);
  }


  static computeDistanceBetweenLatLng(wpt1: any, wpt2: any) {
    return this.distGeographicLib(wpt1.lat(), wpt1.lng(), wpt2.lat(), wpt2.lng())
    //return distVincenty(wpt1.lat(), wpt1.lng(), wpt2.lat(), wpt2.lng())
    // return distHaversine(wpt1.lat(), wpt1.lng(), wpt2.lat(), wpt2.lng())
  };

  static computeDistanceBetween(lat1: any, lng1: any,lat2: any,lng2: any) {
    return this.distGeographicLib(lat1, lng1, lat2, lng2)
    //return distVincenty(wpt1.lat(), wpt1.lng(), wpt2.lat(), wpt2.lng())
    // return distHaversine(wpt1.lat(), wpt1.lng(), wpt2.lat(), wpt2.lng())
  };


  static distGeographicLib(lat1: any, lon1: any, lat2: any, lon2: any) {
    return this.geod.Inverse(lat1, lon1, lat2, lon2).s12;
  }


  static distHaversine(lat1: any, lon1: any, lat2: any, lon2: any) {
    const R = 6371000; // km
    //has a problem with the .toRad() method below.
    const x1 = lat2-lat1;
    const dLat = this.toRad(x1);
    const x2 = lon2-lon1;
    const dLon = this.toRad(x2);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;

  }

  static distVincenty(lat1: any, lon1: any, lat2: any, lon2: any): number {
    let a = 6378137;
    let b = 6356752.3142;
    let f = 1 / 298.257223563; // WGS-84 ellipsoid params
    let L = this.toRad(lon2 - lon1);
    let U1 = Math.atan((1 - f) * Math.tan(this.toRad(lat1)));
    let U2 = Math.atan((1 - f) * Math.tan(this.toRad(lat2)));
    let sinU1 = Math.sin(U1);
    let cosU1 = Math.cos(U1);
    let sinU2 = Math.sin(U2);
    let cosU2 = Math.cos(U2);
    let lambda = L;
    let lambdaP;
    let sigma;
    let sinSigma;
    let cosSigma;
    let cosSqAlpha;
    let cos2SigmaM;
    let iterLimit = 100;
    do {
      let sinLambda = Math.sin(lambda);
      let cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      if (0 === sinSigma) {
        return 0; // co-incident points
      };
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      let sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      let C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      if (isNaN(cos2SigmaM)) {
        cos2SigmaM = 0; // equatorial line: cosSqAlpha = 0 (§6)
      };
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

    if (!iterLimit) {
      return NaN; // formula failed to converge
    };

    let uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    let deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    let s = b * A * (sigma - deltaSigma);
    return s; // round to 1mm precision
  };


}



