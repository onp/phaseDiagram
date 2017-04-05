import { Component } from '@angular/core';

import { EthyleneService } from './ethylene.service';

@Component({
  selector: 'pressure-calculator',
  templateUrl: './pressure-calc.component.html',
  providers: [EthyleneService]
})
export class PressureCalcComponent{

  constructor(
    private ethyleneService: EthyleneService
  ) { }

  density = 653.37;
  temperature = 105;

  pressure = 0;

  calculatePressure(): void {
    this.pressure = this.ethyleneService.pressure(this.density, this.temperature)/1000;
  }
}
