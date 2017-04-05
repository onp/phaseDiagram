import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { PressureCalcComponent }  from './pressure-calc.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    PressureCalcComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
