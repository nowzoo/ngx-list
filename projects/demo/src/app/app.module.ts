import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BootstrapControlsModule } from './bootstrap-controls/bootstrap-controls.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    BootstrapControlsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
