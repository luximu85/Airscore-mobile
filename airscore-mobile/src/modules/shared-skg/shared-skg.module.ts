import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuicklinkModule} from "ngx-quicklink";
import {MenuModule} from "primeng/menu";
import {TabMenuModule} from "primeng/tabmenu";
import {MessageModule} from "primeng/message";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import {FileUploadModule} from "primeng/fileupload";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {SidebarModule} from "primeng/sidebar";
import {AccordionModule} from "primeng/accordion";
import {PanelModule} from "primeng/panel";
import {MetertoKmPipe} from './pipe/misure.pipe';

@NgModule({
  declarations: [
    MetertoKmPipe
  ],
  imports: [
    CommonModule,
    QuicklinkModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    TabMenuModule,
    BreadcrumbModule,
    SelectButtonModule,
    FileUploadModule,
    TableModule,
    SidebarModule,
    AccordionModule,
    PanelModule
  ],exports: [
    CommonModule,
    QuicklinkModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    TabMenuModule,
    BreadcrumbModule,
    SelectButtonModule,
    FileUploadModule,
    TableModule,
    SidebarModule,
    AccordionModule,
    PanelModule,
    MetertoKmPipe
  ],
  providers: []
})
export class SharedSkgModule { }
