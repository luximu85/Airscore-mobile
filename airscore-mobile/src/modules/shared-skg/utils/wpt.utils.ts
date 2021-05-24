import {WaypointModel} from "../model/waypoint/waypoint.model";
import {CoordinatedModel, EDirectionCoor} from "../model/coordinates/coordinated.model";

/**
 * Passare alla funzione il contenuto di un file .wpt, restituisce l'oggetto json
 * @param fileContent
 */
export function parseWPTToJson(fileContent: string | ArrayBuffer | null): Array<WaypointModel> {
  let waypoints: Array<WaypointModel> = [];
  if (fileContent) {
    (<string>fileContent).split(/\r?\n/).forEach(value => {
      if(!value.includes('$')){
        const row: Array<string> = value.split(/[ ,]+/);
        let desc: string = '';
        for (let i = 10; i < row.length; i++) {
          desc = desc + row[i] + ' ';
        }
        waypoints.push(new WaypointModel(
          row[0],
          desc.trim() ,
          new CoordinatedModel(Number(row[2]), Number(row[3]), Number(row[4]), (<EDirectionCoor>row[1])),
          new CoordinatedModel(Number(row[6]), Number(row[7]), Number(row[8]), (<EDirectionCoor>row[5])),
          Number(row[9])));
      }
    });
  }
  return waypoints;
}
