

export class PropertySpace {
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
