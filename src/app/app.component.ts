import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>Ethylene EOS</h1>
    <p>Calculation based on Smukala, Span, and Wagner (2000)</p>
    <pressure-calculator></pressure-calculator>
  `,
})
export class AppComponent  {
  density = 653.37;
  temperature = 105;

}