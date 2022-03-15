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
import { fromEvent, merge, Subject, Subscription } from 'rxjs';
import { takeUntil, concatAll, map, tap } from 'rxjs/operators';

@Directive({
  selector: '[appResizable]',
})
export class ResizableDirective implements AfterViewInit, OnDestroy {
  @Output() moveDistence = new EventEmitter<{ x: number; y: number }>();

  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input() resizeBarWidth = '14px';
  @Input('resizeBarEle') set resizeBarEle(data: HTMLElement) {
    if (!data) {
      return;
    }
    this.resizeBarElement = data;
    this.render.setStyle(
      data,
      'cursor',
      this.direction === 'vertical' ? 'n-resize' : 'e-resize'
    );
    this.render.setStyle(data, 'userSelect', 'none');
    this.render.setStyle(data, 'background', '#fff');
    this.render.setStyle(
      data,
      this.direction === 'horizontal' ? 'min-width' : 'min-height',
      this.resizeBarWidth
    );
    this.render.setStyle(data, 'display', 'flex');
    this.render.setStyle(data, 'justifyContent', 'center');
    this.render.setStyle(data, 'alignItems', 'center');
  }
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
  resizeBarElement: HTMLElement;
  subscription: Subscription;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly render: Renderer2
  ) {}

  ngAfterViewInit() {
    this.initMouseEvent();
  }

  ngOnDestroy() {}

  initMouseEvent() {
    const element = this.elementRef.nativeElement;
    const mouseUpEvent = fromEvent(element, 'mouseup');
    const leaveEvent = fromEvent(element, 'mouseleave');
    const stopPipe$$ = new Subject<void>();
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
              if (event.target !== this.resizeBarElement) {
                stopPipe$$.next(null);
              }
              // console.log('mousemoveEvent = ', mousemoveEvent);
              return {
                startX: event['clientX'],
                startY: event['clientY'],
                moveX: mousemoveEvent['clientX'],
                moveY: mousemoveEvent['clientY'],
              };
            }),
            takeUntil(merge(mouseUpEvent, leaveEvent, stopPipe$$))
          )
        ),
        concatAll()
      )
      .subscribe((e) => {
        const x = e['startX'] - e['moveX'];
        const y = e['startY'] - e['moveY'];
        if (this.direction === 'vertical') {
          this.render.setStyle(
            this.resizeElement,
            'flexBasis',
            `${this.defaultRect.height - y}px`
          );
        } else {
          this.render.setStyle(
            this.resizeElement,
            'flexBasis',
            `${this.defaultRect.width - x}px`
          );
        }
      });
  }
}
