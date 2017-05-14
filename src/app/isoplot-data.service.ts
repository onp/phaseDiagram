import { Injectable } from '@angular/core';

import { PropertiesService } from './properties.service';

declare var Module:any;

export class PropSpace {
  step(i:number): number {return i + 10};
  constructor(readonly property: string,
              readonly min: number,
              readonly max: number,
              readonly steps = 10,
              readonly scaling = "linear"){
    if (scaling == ("log" || "logarithmic")){
      let stepsize = Math.pow(max / min, 1 / steps);
      this.step = (i) => i * stepsize;
    } else {
      let stepsize = (max - min) / steps;
      this.step = (i) => i + stepsize;
    }
  };
}

@Injectable()
export class IsoplotDataService {

  constructor(
    private propertiesService: PropertiesService
  ) { };

  createData(iso:PropSpace, x:PropSpace, y:PropSpace): {iso:number, x:number, y:number}[] {
    let dat: {iso:number, x:number, y:number}[] = [];

    for(let i = iso.min; i < iso.max; i = iso.step(i)){
      for(let j = y.min; j < y.max; j = y.step(j)){
        let val = this.propertiesService.ethylene(x.property, iso.property, i, y.property, j)
        if (isFinite(val) && val < x.max){
          dat.push({iso:i, y:j, x:val});
        }
      }
    }
    return dat
  }

  createPhaseData(x:PropSpace, y:PropSpace): {x:number, y:number}[] {
    let dat: {x:number, y:number}[] = [];
    for(let i = y.min; i < y.max; i = y.step(i)){
      let val = this.propertiesService.ethylene(x.property, y.property, i, "Q", 1)
      console.log(val,i)
      if (isFinite(val) && val < x.max){
        dat.push({iso:1, x:val, y:i});
      } else {
        break
      }
    }
    for(let i = y.min; i < y.max; i = y.step(i)){
      let val = this.propertiesService.ethylene(x.property, y.property, i, "Q", 0)
      console.log(val,i)
      if (isFinite(val) && val < x.max){
        dat.push({iso:0, x:val, y:i});
      } else {
        break
      }
    }
    return dat
  };


}
