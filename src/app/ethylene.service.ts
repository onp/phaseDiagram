// Ethylene EOS - Smukala, Span, and Wagner - 2000
import { Injectable } from '@angular/core';


const ai: number[] = [
  8.68815523,
  -4.47960564,
  3,
  2.49395851,
  3.00271520,
  2.51265840,
  3.99064217
];

const ti: number[] = [
  4.43266896,
  5.74840149,
  7.80278250,
  15.5851154
];

const nr: number[] = [          // n
  0.18617429100670e1,
  -0.30913708460844e1,
  -0.17384817095516,
  0.80370985692840e-1,
  0.23682707317354,
  0.21922786610247e-1,
  0.11827885813193,
  -0.21736384396776e-1,
  0.44007990661139e-1,
  0.12554058863881,
  -0.13167945577241,
  -0.52116984575897e-2,
  0.15236081265419e-3,
  -0.24505335342756e-4,
  0.28970524924022,
  -0.18075836674288,
  0.15057272878461,
  -0.14093151754458,
  0.22755109070253e-1,
  0.1402670529061e-1,
  0.61697454296214e-2,
  -0.41286083451333e-3,
  0.12885388714785e-1,
  0.69128692157093e-1,
  0.10936225568483,
  -0.81818875271794e-2,
  -0.56418472117170e-1,
  0.16517867750633e-2,
  0.95904006517001e-2,
  -0.26236572984886e-2,
  -0.50242414011355e2,
  0.74846420119299e4,
  -0.68734299232625e4,
  -0.93577982814338e3,
  0.94133024786113e3
];

const dr: number[] = [     // d
  1,
  1,
  1,
  2,
  2,
  4,
  1,
  1,
  3,
  4,
  5,
  7,
  10,
  11,
  1,
  1,
  2,
  2,
  4,
  4,
  6,
  7,
  4,
  5,
  6,
  6,
  7,
  8,
  9,
  10,
  2,
  2,
  2,
  3,
  3
];

const tr: number[] = [    // t
  0.5,
  1,
  2.5,
  0,
  2,
  0.5,
  1,
  4,
  1.25,
  2.75,
  2.25,
  1,
  0.75,
  0.5,
  2.5,
  3.5,
  4,
  6,
  1.5,
  5,
  4.5,
  15,
  20,
  23,
  22,
  29,
  19,
  15,
  13,
  10,
  1,
  0,
  1,
  2,
  3
];

const cr: number[] = [   // c
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  3,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4
];

const etar: number[] = [   // eta
  25,
  25,
  25,
  25,
  25
];

const betar: number[] = [    // beta
  325,
  300,
  300,
  300,
  300
];

const gammar: number[] = [    // gamma
  1.16,
  1.19,
  1.19,
  1.19,
  1.19
];

@Injectable()
export class EthyleneService {

  idealHelmholtz(tau: number, delta: number): number {
    // Calculate the ideal portion of the Helmholtz free energy.
    let ihe = Math.log(delta) + ai[0] + ai[1] * tau + ai[2] * Math.log(tau);
    for (let i = 0; i < 4; i++) {
      ihe += ai[i+3] * Math.log(1 - Math.exp(-ti[i] * tau));
    }
    return ihe;
  }

  residualHelmholtz(tau: number, delta: number): number {
    // Calculate the residual portion of the Helmholtz free energy
    let rhe = 0
    let i
    for (i = 0; i < 6; i++) {
      rhe += nr[i] * Math.pow(delta, dr[i]) * Math.pow(tau, tr[i])
    }
    for (i = 0; i < 24; i++) {
      rhe += nr[i + 6] * Math.pow(delta, dr[i + 6]) * Math.pow(tau, tr[i + 6]) * Math.exp(-Math.pow(delta, cr[i]))
    }
    for (i = 0; i < 5; i++) {
      rhe += nr[i + 30] * Math.pow(delta, dr[i + 30]) * Math.pow(tau, tr[i + 30]) * Math.exp(-etar[i] * Math.pow(delta - 1, 2) - betar[i] * Math.pow(tau - gammar[i], 2))
    }
    return rhe;
  }

  residualHelmholtz_d(tau: number, delta: number): number {
    // first derivative of the residual Helmholtz energy wrt density.
    let rhe = 0
    let i
    for (i = 0; i < 6; i++) {
      let term = nr[i] * dr[i] * Math.pow(delta, dr[i] - 1) * Math.pow(tau, tr[i]);
      rhe += term;
    }
    for (i = 0; i < 24; i++) {
      let term = nr[i + 6] * Math.exp(-Math.pow(delta, cr[i])) * (Math.pow(delta, dr[i + 6] - 1) * Math.pow(tau, tr[i + 6]) * (dr[i + 6] - cr[i] * Math.pow(delta, cr[i])));
      rhe += term;
    }
    for (i = 0; i < 5; i++) {
      let term = nr[i + 30] * Math.pow(delta, dr[i + 30]) * Math.pow(tau, tr[i + 30]) * Math.exp(-etar[i] * Math.pow(delta - 1, 2) - betar[i] * Math.pow(tau - gammar[i], 2)) * (dr[i + 30] / delta - 2 * etar[i] * (delta - 1));
      rhe += term;
    }
    return rhe;
  }

  helmholtzEnergy(density: number, temperature: number): number {
    // Units in kg/m3, K
    const dc = 214.24;
    const tc = 282.35;

    let densityReduced = density / dc;
    let tempInvReduced = tc / temperature;

    let ihe = this.idealHelmholtz(densityReduced, tempInvReduced);
    let rhe = this.residualHelmholtz(densityReduced, tempInvReduced);

    return ihe + rhe;
  }

  pressure(density: number, temperature: number): number {
    // Units in kg/m3, K
    const dc = 214.24;
    const tc = 282.35;

    let densityReduced = density / dc;
    let tempInvReduced = tc / temperature;

    let p = (1 + densityReduced * this.residualHelmholtz_d(densityReduced, tempInvReduced)) * density * temperature * 0.296384079;

    return p;
  }
}
