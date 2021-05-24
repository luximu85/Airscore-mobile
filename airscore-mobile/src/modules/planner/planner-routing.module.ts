import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlannerTaskComponent} from "../planner/components/planner-task/planner-task.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'task',
    pathMatch: 'full'
  },
  {
    path: 'task',
    component: PlannerTaskComponent,
    // canActivate: [AuthenticationService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule { }
