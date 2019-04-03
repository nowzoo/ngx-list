import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxListBootstrapControlsModule } from '@nowzoo/ngx-list';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { PaginationSliderComponent } from './pagination-slider/pagination-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    PaginationSliderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxListBootstrapControlsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
