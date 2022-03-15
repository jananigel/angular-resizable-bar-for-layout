import { AfterViewInit, Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  elementStartParams = { width: 0, height: 0 };

  constructor(private readonly render: Renderer2) {}

  ngAfterViewInit() {
    // const elementClientRect = resizeEle.getBoundingClientRect();
    // const eleHeight = elementClientRect.height;
    // const eleWidth = elementClientRect.width;
    // this.elementStartParams.width = JSON.parse(JSON.stringify(eleWidth));
    // this.elementStartParams.height = JSON.parse(JSON.stringify(eleHeight));
  }

  onResizableHeight(event: { x: number; y: number }, resizeEle: HTMLElement) {
    // resizeEle.style.height = `${this.elementStartParams.height - event.y}px`;
    // console.log('elementStartParams = ', this.elementStartParams);
    this.render.setStyle(resizeEle, 'flexBasis', `${100 - event.y}px`);
  }
}
