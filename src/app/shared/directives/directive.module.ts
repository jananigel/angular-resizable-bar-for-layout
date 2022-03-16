import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ResizableDirective } from './resizable.directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [ResizableDirective],
  exports: [ResizableDirective],
})
export class DirectiveModule {}
