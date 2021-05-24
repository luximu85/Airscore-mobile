import {Component, Input, OnInit} from '@angular/core';
import {RouteTask} from "../../utils/route-task.class";

@Component({
  selector: 'skg-task-board-panel',
  templateUrl: './task-board-panel.component.html',
  styleUrls: ['./task-board-panel.component.scss']
})
export class TaskBoardPanelComponent implements OnInit {

  @Input() routeTask!: RouteTask;

  constructor() { }

  ngOnInit(): void {
  }

}
