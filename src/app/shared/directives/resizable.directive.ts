import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { takeUntil, concatAll, map, tap } from 'rxjs/operators';

@Directive({
  selector: '[appResizable]',
})
export class ResizableDirective implements AfterViewInit, OnDestroy {
  @Output() moveDistence = new EventEmitter<{ x: number; y: number }>();

  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input('resizeEle') set resizeEle(data: HTMLElement) {
    if (!data) {
      return;
    }
    this.resizeElement = data;
    this.defaultRect = {
      width: data.getBoundingClientRect().width,
      height: data.getBoundingClientRect().height,
    };
  }

  defaultRect = { width: 0, height: 0 };
  resizeElement: HTMLElement;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly render: Renderer2
  ) {}

  ngAfterViewInit() {
    this.initDefaultElement();
    this.initMouseEvent();
  }

  ngOnDestroy() {}

  initDefaultElement() {
    // const element = this.elementRef.nativeElement;
    // this.render.setStyle(element, 'display', 'block');
    // this.render.setStyle(element, 'textAlign', 'center');
    // this.render.setStyle(element, 'userSelect', 'none');
    // this.render.setStyle(
    //   element,
    //   'cursor',
    //   this.direction === 'vertical' ? 'n-resize' : 'e-resize'
    // );
  }

  initMouseEvent() {
    const element = this.elementRef.nativeElement;
    const mouseUpEvent = fromEvent(element, 'mouseup');
    // const leaveEvent = fromEvent(element, 'mouseleave');
    fromEvent(element, 'mousedown')
      .pipe(
        tap((event: Event) => {
          event.stopPropagation();
          this.defaultRect = {
            width: this.resizeElement.getBoundingClientRect().width,
            height: this.resizeElement.getBoundingClientRect().height,
          };
        }),
        map((event) =>
          fromEvent(element, 'mousemove').pipe(
            map((mousemoveEvent) => {
              // console.log('mousemoveEvent = ', mousemoveEvent);
              return {
                startX: event['clientX'],
                startY: event['clientY'],
                moveX: mousemoveEvent['clientX'],
                moveY: mousemoveEvent['clientY'],
              };
            }),
            takeUntil(merge(mouseUpEvent))
          )
        ),
        concatAll()
      )
      .subscribe((e) => {
        const x = e['startX'] - e['moveX']; //0 ? 1 : -1;
        const y = e['startY'] - e['moveY']; //0 ? 1 : -1;
        // console.log('event = ', e, ' x = ', x, ' y = ', y);
        if (this.direction === 'vertical') {
          this.render.setStyle(
            this.resizeElement,
            'flexBasis',
            `${this.defaultRect.height - y}px`
          );
        } else {
          // console.log('horizontal = ', this.defaultRect);
          this.render.setStyle(
            this.resizeElement,
            'flexBasis',
            `${this.defaultRect.width - x}px`
          );
        }
        // this.moveDistence.next({ x, y });
      });
  }
}
