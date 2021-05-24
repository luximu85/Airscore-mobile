import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MenuItem, PrimeIcons} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

interface IBreadcrumb {
  keyLabel: string;
  urlPath: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app-breadcrumb.component.html',
  styleUrls: ['./app-breadcrumb.component.scss']
})
export class AppBreadcrumbComponent implements OnInit {

  /**
   * lista di elementi
   */
  listBreadcrumb: Array<IBreadcrumb> = [];

  breadcrumbItems: MenuItem[] = [];

  home: MenuItem = {icon: PrimeIcons.HOME, routerLink: '/'};

  constructor(private readonly router: Router,
              private translateService: TranslateService) { }
  /**
   * override di oninit
   */
  ngOnInit() {
    this.listenRouting();
    // this.translateService.stream().subscribe(value => {
    //
    // })
  }

  /**
   * ascolto sul routing
   * parto dall'urlInternal e definisco la rotta
   *
   */
  listenRouting() {
    let routerUrl: string, routerList: Array<any>, target: string;
    this.router.events.subscribe((router: any) => {
      if (router instanceof NavigationEnd) {
        routerUrl = router.urlAfterRedirects;
        if (routerUrl && typeof routerUrl === 'string') {
          // breadcrumb
          this.listBreadcrumb.length = 0;
          // routing urlOperation / , [0]=, [1]= ...etc
          const indexSpecialaChar = routerUrl.indexOf("?");
          if(indexSpecialaChar != -1) routerUrl= routerUrl.substr(0,indexSpecialaChar);
          routerList = routerUrl.slice(1).split(/[/]/);
          routerList.forEach((router, index) => {
            // menu routing
            target = router;
            // breadcrumbList loop list
            this.listBreadcrumb.push({
              keyLabel: 'BREADCRUMB.'+ target.toUpperCase(),
              //routing, routing
              urlPath: (index === 0) ? '/'+target : `${this.listBreadcrumb[index-1].urlPath}/${target}`
            });
            this.assemblyItemsBreadscrumb();
          });
        }
      }
    });
  }

  assemblyItemsBreadscrumb() {
    this.breadcrumbItems = this.listBreadcrumb.map(value => new Object({label: this.translateService.instant(value.keyLabel), routerLink: value.urlPath}));
  }

}
