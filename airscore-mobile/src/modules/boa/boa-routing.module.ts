import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoaManagementComponent} from "./components/boa-management/boa-management.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'boa-management',
    pathMatch: 'full'
  },
  {
    path: 'boa-management',
    component: BoaManagementComponent,
    // canActivate: [AuthenticationService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoaRoutingModule { }
