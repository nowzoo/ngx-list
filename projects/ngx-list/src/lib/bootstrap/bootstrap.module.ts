import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxListBoostrapPaginationComponent } from './pagination/pagination.component';
import { NgxListBoostrapRppComponent } from './rpp/rpp.component';
import { NgxListBootstrapSortComponent } from './sort/sort.component';

@NgModule({
  declarations: [
    NgxListBoostrapPaginationComponent,
    NgxListBoostrapRppComponent,
    NgxListBootstrapSortComponent,
  ],
  exports: [
    NgxListBoostrapPaginationComponent,
    NgxListBoostrapRppComponent,
    NgxListBootstrapSortComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class NgxListBootstrapModule { }
