import { Component} from '@angular/core';

import { PropertySpace } from './property-space';

@Component({
  selector: 'property-space',
  templateUrl: './property-space.component.html'
})
export class PropertySpaceComponent{

  constructor(

  ) { }

  density = 653.37;
  temperature = 105;

  pressure: number;
  enthalpy: number;

}
