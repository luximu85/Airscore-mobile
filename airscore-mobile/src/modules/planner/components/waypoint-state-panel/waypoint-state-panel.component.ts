import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {WaypointManage} from "@shared/model/waypoint/waypoint.model";
import {TurnpointEnum, TurnpointType} from "@shared/type/task.type";


@Component({
  selector: 'skg-waypoint-state-panel',
  templateUrl: './waypoint-state-panel.component.html',
  styleUrls: ['./waypoint-state-panel.component.scss']
})
export class WaypointStatePanelComponent implements OnInit {

  @Input() waypointSelected: WaypointManage | undefined;
  @Output() waypointSelectedChange = new EventEmitter<WaypointManage>();
  _turnpointEnum = TurnpointEnum;

  constructor() { }

  ngOnInit(): void {
  }

  changeStatusWaypoint(state: TurnpointType) {
    if (this.waypointSelected?.state === state) {
      this.waypointSelected.active = !this.waypointSelected.active;
    } else if (this.waypointSelected) {
      this.waypointSelected.state = state;
      this.waypointSelected.active = true;
    }
    this.waypointSelectedChange.emit(this.waypointSelected);
  }
}
