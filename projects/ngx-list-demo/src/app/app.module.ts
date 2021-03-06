import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';


import { NgxListBootstrapModule } from '@nowzoo/ngx-list';
import { DataService } from './data.service';

import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxListBootstrapModule,
    MomentModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
