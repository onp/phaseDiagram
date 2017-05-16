import { Injectable } from '@angular/core';

import { PropertiesService } from './properties.service';
import { PropertySpace } from './property-space'

declare var Module:any;

@Injectable()
export class IsoplotDataService {

  constructor(
    private propertiesService: PropertiesService
  ) { };

  createData(iso:PropertySpace, x:PropertySpace, y:PropertySpace): {iso:number, x:number, y:number}[] {
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

  createPhaseData(x:PropertySpace, y:PropertySpace): {x:number, y:number}[] {
    let tcrit = this.propertiesService.ethylene("Tcrit", "", 0, "", 0)
    let pcrit = this.propertiesService.ethylene("Pcrit", "", 0, "", 0)
    let xcrit = this.propertiesService.ethylene(x.property, "T", tcrit, "P", pcrit)
    let ycrit = this.propertiesService.ethylene(y.property, "T", tcrit, "P", pcrit)

    let dat: {iso:number, x:number, y:number}[] = [];
    for(let i = y.min; i < y.max; i = y.step(i)){
      let val = this.propertiesService.ethylene(x.property, y.property, i, "Q", 1)
      console.log(val,i)
      if (isFinite(val) && val < x.max){
        dat.push({iso:1, x:val, y:i});
      } else {
        dat.push({iso:1, x:xcrit, y:ycrit});
        break
      }
    }
    for(let i = y.min; i < y.max; i = y.step(i)){
      let val = this.propertiesService.ethylene(x.property, y.property, i, "Q", 0)
      console.log(val,i)
      if (isFinite(val) && val < x.max){
        dat.push({iso:0, x:val, y:i});
      } else {
        dat.push({iso:0, x:xcrit, y:ycrit});
        break
      }
    }
    return dat
  };


}
