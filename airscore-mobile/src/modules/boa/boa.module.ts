import {NgModule} from '@angular/core';
import {SharedSkgModule} from "@shared/shared-skg.module";
import {BoaRoutingModule} from "./boa-routing.module";
import {BoaManagementComponent} from './components/boa-management/boa-management.component';


@NgModule({
  declarations: [
    BoaManagementComponent
  ],
    imports: [
        BoaRoutingModule,
        SharedSkgModule
    ]
})
export class BoaModule { }
