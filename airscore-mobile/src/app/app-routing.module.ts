import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuicklinkStrategy} from "ngx-quicklink";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'boa',
    pathMatch: 'full'
  },
  {
    path: 'boa',
    loadChildren: () => import('../modules/boa/boa.module').then(m => m.BoaModule)
  },
  {
    path: 'planner',
    loadChildren: () => import('../modules/planner/planner.module').then(m => m.PlannerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    preloadingStrategy: QuicklinkStrategy,
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
