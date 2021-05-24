import {AfterViewInit, Component, ElementRef, OnInit, ViewChildren} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import OlXYZ from 'ol/source/xyz';
// import OSM, {ATTRIBUTION} from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import {Feature} from 'ol';
import {Circle, Geometry, MultiLineString, Point} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import {createTurnpointFromCircle, TurnpointModel} from '../../model/turnpoint.model';
import {RouteTask} from '../../utils/route-task.class';
import {LatLngModel} from '@shared/model/coordinates/lat-lng.model';
import {StorageService} from "@shared/services/storage.service";
import {WaypointGroupModel, WaypointManage} from "@shared/model/waypoint/waypoint.model";
import {Zoom} from "ol/control";
import {TurnpointEnum, TurnpointType} from "@shared/type/task.type";
import {Draw, Modify, Snap} from "ol/interaction";
import GeometryType from "ol/geom/GeometryType";
import {METERS_PER_UNIT} from "ol/proj/Units";

@Component({
  selector: 'skg-planner-task',
  templateUrl: './planner-task.component.html',
  styleUrls: ['./planner-task.component.scss']
})
export class PlannerTaskComponent implements OnInit, AfterViewInit {

  @ViewChildren('popup') vcPopup: ElementRef | undefined;
  waypointSelected: WaypointManage | undefined;
  _turnpointEnum = TurnpointEnum;
  routeTask: RouteTask = new RouteTask();
  listTurnpoint: Array<TurnpointModel> = [];

  map: Map | undefined;

  normaPlace = [12.957067, 41.590967];

  polylineFeature: Feature = new Feature();

  circleFeature = new Feature({
    geometry: new Circle(olProj.fromLonLat(this.normaPlace), 5000)
  });

  raster = new TileLayer({
    source: new OlXYZ({
      url:'http://tile.stamen.com/terrain/{z}/{x}/{y}.png',
      projection: 'EPSG:3857'
    }),
    visible: true
  });

  source = new VectorSource({
  });

  vector = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255,255,255,0.2)',
      }),
      stroke: new Stroke({
        color: '#f50505',
        width: 2,
      }),
      // image: new CircleStyle({
      //   radius: 7,
      //   fill: new Fill({
      //     color: '#ffcc33',
      //   }),
      // }),
    })
  })

  markers = new VectorLayer({
    source: this.source
  })

  task = new VectorLayer({
    source: this.source
  })


  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.buildCircle();
    this.initMap();
    this.initListeners();
    this.addMarker();
    this.map?.updateSize();
  }

  initMap() {
    this.map = new Map({
      target: 'planner_map',
      layers: [this.raster, this.vector, this.markers, this.task],
      view: new View({
        center: olProj.fromLonLat(this.normaPlace),
        zoom: 10,
        maxZoom: 13
      })
    });
    this.map.getControls().clear();
    this.map.addControl(new Zoom({
      className: 'control-zoom',
    }));

    // this.map.addInteraction(new Modify({source: this.source}))
    // const draw = new Draw({
    //   source: this.source,
    //   type: GeometryType.CIRCLE
    // });
    // this.map.addInteraction(draw);
    // const snap = new Snap({source: this.source});
    // this.map.addInteraction(snap);

    /**Mi metto in ascolto su un particolare evento*/
    this.map.on('singleclick' , sgc => {
      this.buildTask();
    });

    this.map.on('pointerdrag', (evt) => {
      let feature = evt.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      const turnPoint = feature?.get('turnPoint');
      if (turnPoint) {
        this.buildTask();
        console.log(feature);
      }
    });

    // display popup on click
    this.map.on('click', (evt) => {
      let feature = evt.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      console.log(feature);
      const waypoint = feature?.get('waypoint');
      if (waypoint) {
        this.waypointSelected = waypoint;
      }
    });
  }

  addMarker() {
    const wayPointGrup = (<WaypointGroupModel>this.storageService.getStorageKey('WAY_POINT_GROUP'));
    if (wayPointGrup && wayPointGrup.waypoints.length > 0) {
      wayPointGrup.waypoints.forEach(wp => {
        let marker = new Feature(new Point(olProj.fromLonLat([wp.lng.convertDMSToDD(), wp.lat.convertDMSToDD()])));
        const waypoint: WaypointManage = new WaypointManage(wp);
        marker.setProperties({waypoint}, false);
        marker.setStyle(this.buildSyleMarker(waypoint.cod));
        this.markers.getSource().addFeature(marker);
      })
    }
  }

  buildSyleMarker(codBoa: string): Style {
    const style: Style = new Style({
        text: new Text({
          text: codBoa,
          font:'bold 12px ariel',
          scale: 1,
        }),
        image: new CircleStyle({
          radius: 15,
          fill: new Fill({
            color: '#fed800',
          }),
          stroke: new Stroke({
            color: '#010000',
            width: 1
          })
        }),
      // image: new Icon({
      //   anchor: [0.4, 1],
      //   color: '#f5d105',
      //   src: 'image/pin.svg',
      //   opacity: 1,
      //   scale: 0.25
      // })
      });
    return style;
  }

  initListeners() {
    // this.source.on('addfeature', sr => {
    //   console.log(sr);
    //   const features: Array<Feature<Geometry>> = this.source.getFeatures();
    //   console.log(features);
    // })
  }

  changeStateWaypointSelected(event: WaypointManage) {
    let turnP = new Feature(new Circle(olProj.fromLonLat([event.lng.convertDMSToDD(), event.lat.convertDMSToDD()]), 1000));
    const index = this.listTurnpoint.length;
    const turnPoint: TurnpointModel = createTurnpointFromCircle((<Circle>turnP.getGeometry()), TurnpointEnum.CYLINDER);
    this.listTurnpoint.push(turnPoint)
    turnP.setProperties({idTask: index, turnPoint}, false);
    this.task.getSource().addFeature(turnP);
    console.log(turnP);
  }

  buildTask() {
    const features: Array<Feature<Geometry>> = this.source.getFeatures();
    let listTurnpoint: Array<TurnpointModel> = [];
    features.forEach(f => {
      if (f.getGeometry() instanceof Circle) {
        const circle = (<Circle>f.getGeometry());
        listTurnpoint.push(createTurnpointFromCircle(circle, TurnpointEnum.CYLINDER));
      }
    });
    this.routeTask.routeOptimizeTask(listTurnpoint);
    this.buildPolyline(this.routeTask.pointsRouteOptimized);
  }

  buildPolyline(linePoint: Array<LatLngModel>) {
    if (this.polylineFeature?.getId() === 'route_optmize') {
      this.source.removeFeature(this.polylineFeature);
    }
    let coordinate: Array<Array<number>> = linePoint.map(value => value.toCoordinateLngLat());
    let coordinateTransform: Array<Array<number>> = coordinate.map(value => olProj.transform(value, 'EPSG:4326', 'EPSG:3857'));
    const polyline = new MultiLineString([coordinateTransform]);
    this.polylineFeature = new Feature({
      name: 'RouteOptmize',
      geometry: polyline
    });
    this.polylineFeature.setId('route_optmize');
    this.source.addFeature(this.polylineFeature);
  }

  /**
   * Costruisci cilindro
   */
  buildCircle() {
    this.circleFeature.setStyle(
      new Style({
        renderer: function renderer(coordinates, state) {
          let coordinates_0: any[] = (<[]>coordinates[0]);
          let x = coordinates_0[0];
          let y = coordinates_0[1];
          let coordinates_1: any[] = (<[]>coordinates[1]);
          let x1 = coordinates_1[0];
          let y1 = coordinates_1[1];
          let ctx = state.context;
          let dx = x1 - x;
          let dy = y1 - y;
          let radius = Math.sqrt(dx * dx + dy * dy);

          let innerRadius = 0;
          let outerRadius = radius * 1.4;

          let gradient = ctx.createRadialGradient(
            x,
            y,
            innerRadius,
            x,
            y,
            outerRadius
          );
          gradient.addColorStop(0, 'rgba(255,0,0,0)');
          gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
          gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
          ctx.strokeStyle = 'rgba(255,0,0,1)';
          ctx.stroke();
        },
      })
    );
  }




}

