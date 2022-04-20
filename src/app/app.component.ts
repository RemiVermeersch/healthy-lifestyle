import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  config: any;
  fullpage_api: any;
  title = 'healthy-lifestyle';

  constructor() {

    // for more details on config options please visit fullPage.js docs
    this.config = {

      // fullpage options
      licenseKey: 'YOUR LICENSE KEY HERE',
      anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage', 'lastPage'],
      menu: '#menu',

      // fullpage callbacks
      afterResize: () => {
        console.log("After resize");
      },
      afterLoad: (origin: { index: any; }, destination: any, direction: any) => {
        console.log(origin.index);
      }
    };
  }
  
  getRef(fullPageRef: any) {
    this.fullpage_api = fullPageRef;
  }
}
