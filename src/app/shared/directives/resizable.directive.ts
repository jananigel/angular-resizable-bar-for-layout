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

interface MoveInfo {
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
}

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
    this.updateResizableBarStyle(this.resizeBarElement);
  }
  @Input('resizeEle') set resizeEle(data: HTMLElement) {
    if (!data) {
      return;
    }
    this.resizeElement = data;
    this.storeOriginalRect(data);
  }

  originalRect = { width: 0, height: 0 };
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  initMouseEvent() {
    const element = this.elementRef.nativeElement;
    const mouseUpEvent = fromEvent(element, 'mouseup');
    const leaveEvent = fromEvent(element, 'mouseleave');
    const stopPipe$$ = new Subject<void>();
    this.subscription = fromEvent(element, 'mousedown')
      .pipe(
        tap((event: MouseEvent) => {
          event.stopPropagation();
          this.storeOriginalRect(this.resizeElement);
        }),
        map((event: MouseEvent) =>
          fromEvent(element, 'mousemove').pipe(
            map((mousemoveEvent: MouseEvent) => {
              const isNotClickResizeBar =
                event.target !== this.resizeBarElement;
              if (isNotClickResizeBar) {
                stopPipe$$.next(null);
              }
              return {
                startX: event.clientX,
                startY: event.clientY,
                moveX: mousemoveEvent.clientX,
                moveY: mousemoveEvent.clientY,
              };
            }),
            takeUntil(merge(mouseUpEvent, leaveEvent, stopPipe$$))
          )
        ),
        concatAll()
      )
      .subscribe((e: MoveInfo) => {
        this.resizeFrame(e);
      });
  }

  private resizeFrame(e: MoveInfo) {
    const x = e.startX - e.moveX;
    const y = e.startY - e.moveY;
    const { width, height } = this.originalRect;
    const isVertical = this.direction === 'vertical';
    const size = isVertical ? height - y : width - x;
    this.render.setStyle(this.resizeElement, 'flexBasis', `${size}px`);
  }

  private storeOriginalRect(ele: HTMLElement) {
    this.originalRect = {
      width: ele.getBoundingClientRect().width,
      height: ele.getBoundingClientRect().height,
    };
  }

  private updateResizableBarStyle(ele: HTMLElement) {
    const minWidthHeight =
      this.direction === 'horizontal' ? 'min-width' : 'min-height';
    const isVertical = this.direction === 'vertical';
    this.render.setAttribute(
      ele,
      'style',
      `
        cursor: ${isVertical ? 'n-resize' : 'e-resize'};
        user-select: none;
        background: #fff;
        ${minWidthHeight}: ${this.resizeBarWidth};
        display: flex;
        justify-content: center;
        align-items: center;
    `
    );
  }
}
