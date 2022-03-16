import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ResizableDirective } from './directives/resizable.directive';
import { ResizableHorizontalFrame } from './components/layouts/resizable-horizontal-frame/resizable-horizontal-frame.component';
import { ResizableVerticalFrame } from './components/layouts/resizable-vertical-frame/resizable-vertical-frame.component';
import { DirectiveModule } from './directives/directive.module';

@NgModule({
  imports: [BrowserModule, FormsModule, DirectiveModule],
  declarations: [ResizableHorizontalFrame, ResizableVerticalFrame],
  exports: [ResizableHorizontalFrame, ResizableVerticalFrame],
})
export class SharedModule {}
