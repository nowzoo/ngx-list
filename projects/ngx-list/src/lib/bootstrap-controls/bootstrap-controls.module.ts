import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxListBootstrapSortLinkComponent } from './sort-link/sort-link.component';
import { NgxListBootstrapSearchControlComponent } from './search-control/search-control.component';

@NgModule({
  declarations: [
    NgxListBootstrapSortLinkComponent,
    NgxListBootstrapSearchControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    NgxListBootstrapSortLinkComponent,
    NgxListBootstrapSearchControlComponent
  ]
})
export class NgxListBootstrapControlsModule { }
