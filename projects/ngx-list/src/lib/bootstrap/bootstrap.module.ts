import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxListBoostrapPaginationComponent } from './pagination/pagination.component';
import { NgxListBoostrapRppComponent } from './rpp/rpp.component';
import { NgxListBootstrapSortComponent } from './sort/sort.component';
import { NgxListBootstrapSearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    NgxListBoostrapPaginationComponent,
    NgxListBoostrapRppComponent,
    NgxListBootstrapSortComponent,
    NgxListBootstrapSearchComponent,
  ],
  exports: [
    NgxListBoostrapPaginationComponent,
    NgxListBoostrapRppComponent,
    NgxListBootstrapSortComponent,
    NgxListBootstrapSearchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class NgxListBootstrapModule { }
