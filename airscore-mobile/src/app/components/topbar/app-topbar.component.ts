import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

interface ILang {
  name: string,
  code: string
}

@Component({
  selector: 'app-topbar',
  templateUrl: './app-topbar.component.html',
  styleUrls: ['./app-topbar.component.scss']
})
export class AppTopbarComponent implements OnInit {

  langs: Array<ILang> = [
    {name: 'ITA', code: 'it'},
    {name: 'EN', code: 'en'},
    ];

  selectedLang: ILang = {name: 'ITA', code: 'it'};

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  useLanguage(language: ILang): void {
    this.translateService.use(language.code);
  }

}
