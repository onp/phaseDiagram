import { Component, OnInit } from '@angular/core';

import { EthyleneService } from './ethylene.service';

@Component({
  selector: 'pressure-calculator',
  templateUrl: './pressure-calc.component.html',
  providers: [EthyleneService]
})
export class PressureCalcComponent implements OnInit{

  constructor(
    private ethyleneService: EthyleneService
  ) { }

  ngOnInit(): void {
    this.calculatePressure();
  }

  density = 653.37;
  temperature = 105;

  pressure: number;

  calculatePressure(): void {
    this.pressure = this.ethyleneService.pressure(this.density, this.temperature)/1000;
  }
}
