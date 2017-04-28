// Coolprop backend.
// http://www.coolprop.org/coolprop/wrappers/Javascript/index.html#javascript

import { Injectable } from '@angular/core';

declare var Module:any;

@Injectable()
export class PropertiesService {

  ethylene(out: string, key1: string, val1: number, key2: string,
           val2: number):number{
    return Module.PropsSI(out, key1, val1, key2, val2, "Ethylene")
  }

  PropsSI(out: string, key1: string, val1: number, key2: string, val2: number,
          fluid: string):number{
    return Module.PropsSI(out, key1, val1, key2, val2, fluid)
  }



}
