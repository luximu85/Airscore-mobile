import {NgModule} from '@angular/core';
import {SharedSkgModule} from "../shared-skg/shared-skg.module";
import {PlannerTaskComponent} from "./components/planner-task/planner-task.component";
import {PlannerRoutingModule} from "./planner-routing.module";
import { WaypointStatePanelComponent } from './components/waypoint-state-panel/waypoint-state-panel.component';
import { TaskBoardPanelComponent } from './components/task-board-panel/task-board-panel.component';


@NgModule({
  declarations: [
    PlannerTaskComponent,
    WaypointStatePanelComponent,
    TaskBoardPanelComponent
  ],
  imports: [
    PlannerRoutingModule,
    SharedSkgModule
  ]
})
export class PlannerModule { }
