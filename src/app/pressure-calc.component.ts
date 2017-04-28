import { Component, OnInit } from '@angular/core';

import { PropertiesService } from './properties.service';

@Component({
  selector: 'pressure-calculator',
  templateUrl: './pressure-calc.component.html',
  providers: [PropertiesService]
})
export class PressureCalcComponent implements OnInit{

  constructor(
    private propertiesService: PropertiesService
  ) { }

  ngOnInit(): void {
    this.calculatePressure();
  }

  density = 653.37;
  temperature = 105;

  pressure: number;
  enthalpy: number;

  calculatePressure(): void {
    this.pressure = this.propertiesService.ethylene("P", "D", +this.density, "T", +this.temperature)/1000;
    this.enthalpy = this.propertiesService.ethylene("H", "D", +this.density, "T", +this.temperature)/1000;
  }
}
