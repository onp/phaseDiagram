// Ethylene EOS - Smukala, Span, and Wagner - 2000
import { Injectable } from '@angular/core';

import { ai, ti, nr, dr, tr, cr, etar, betar, gammar } from "./ethylene.data"

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

    let delta = density / dc;
    let tau = tc / temperature;

    let p = (1 + delta * this.residualHelmholtz_d(tau, delta)) * density * temperature * 0.296384079;

    return p;
  }
}
