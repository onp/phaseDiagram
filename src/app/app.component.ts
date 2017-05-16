import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>Ethylene EOS</h1>
    <p>Calculation based on Smukala, Span, and Wagner (2000), as implemented by <a href="http://www.coolprop.org/">CoolProp</a></p>
    <div class="topbox">
      <pressure-calculator class="topelement"></pressure-calculator>
      <property-space class="topelement"></property-space>
    </div>
    <isobar-plot></isobar-plot>
  `,
  styles:[`
    .topbox {
      display: flex;
    }

    .topelement {
      padding:5px;
      margin: 5px;
      border: 1px solid black;
      height: 150px;
    }
    `]
})
export class AppComponent  {
  density = 653.37;
  temperature = 105;

}
