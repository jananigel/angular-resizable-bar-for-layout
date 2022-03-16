import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ResizableDirective } from './directives/resizable.directive';
import { ResizableHorizontalFrame } from './components/layouts/resizable-horizontal-frame/resizable-horizontal-frame.component';
import { ResizableVerticalFrame } from './components/layouts/resizable-vertical-frame/resizable-vertical-frame.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    ResizableDirective,
    ResizableHorizontalFrame,
    ResizableVerticalFrame,
  ],
  exports: [
    ResizableDirective,
    ResizableHorizontalFrame,
    ResizableVerticalFrame,
  ],
})
export class SharedModule {}
