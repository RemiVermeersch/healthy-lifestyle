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
      anchors: ['firstPage', 'secondPage', 'EconomyAndFinance', 'fourthPage', 'lastPage'],
      sectionsColor: ['yellow', 'orange', '#C3E9C0', '#ADD8E6'],
      scrollHorizontally: true,
      verticalCentered: false,
      loopHorizontal: false,
      continuousHorizontal: false,
      controlArrowsHTML: [
        '<i class="fa-solid fa-angle-left"></i>', 
        '<i class="fa-solid fa-angle-right"></i>'
      ],

      // fullpage callbacks
      afterResize: () => {
        console.log("After resize");
      },
      afterLoad: (origin: { index: any; }, destination: any, direction: any) => {
        let arrow_left:HTMLCollectionOf<Element> = document.getElementsByClassName("fp-controlArrow fp-prev");
        Array.from(arrow_left).forEach(it => {
          it.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
        })

        const arrow_right = document.getElementsByClassName("fp-controlArrow fp-next");
        Array.from(arrow_right).forEach(it => {
          it.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;
        })
      },
      afterRender: () => {
        
      }
    };
  }

  ngAfterViewInit(){

  }

  getRef(fullPageRef: any) {
    this.fullpage_api = fullPageRef;
  }
}
