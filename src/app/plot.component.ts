import { Component, OnInit } from '@angular/core';

import { EthyleneService } from './ethylene.service';

import * as d3 from 'd3';

@Component({
  selector: 'isobar-plot',
  template: `
    <button (click)="transition()">Update</button>
    <svg width="960" height="500"></svg>
  `,
  providers: [EthyleneService]
})
export class IsobarPlotComponent implements OnInit{

  constructor(
    private ethyleneService: EthyleneService
  ) { }

  transition(): void {
    console.log("old def")
  }

  ngOnInit(): void {
    let n = 20; // number of layers
    let m = 200; // number of samples per layer
    let k = 10; // number of bumps per layer

    let stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle);
    let layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); })));
    let layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); })));
    let layers = layers0.concat(layers1);

    let svg = d3.select("svg");
    let width = +svg.attr("width");
    let height = +svg.attr("height");

    let x = d3.scaleLinear()
        .domain([0, m - 1])
        .range([0, width]);

    let y = d3.scaleLinear()
        .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
        .range([height, 0]);

    let z = d3.interpolateCool;

    let area = d3.area()
        .x(function(d, i) { return x(i); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); });

    svg.selectAll("path")
      .data(layers0)
      .enter().append("path")
        .attr("d", area)
        .attr("fill", function() { return z(Math.random()); });

    function stackMax(layer: any) {
      return d3.max(layer, function(d) { return d[1]; });
    }

    function stackMin(layer: any) {
      return d3.min(layer, function(d) { return d[0]; });
    }

    function transition() {
      var t;
      d3.selectAll("path")
        .data((t = layers1, layers1 = layers0, layers0 = t))
        .transition()
          .duration(2500)
          .attr("d", area);
    }

    this.transition = transition;

    // Inspired by Lee Byron’s test data generator.
    function bumps(n: number, m: number) {
      let a = [], i;
      for (i = 0; i < n; ++i) a[i] = 0;
      for (i = 0; i < m; ++i) bump(a, n);
      return a;
    }

    function bump(a: number[], n: number) {
      var x = 1 / (0.1 + Math.random()),
          y = 2 * Math.random() - 0.5,
          z = 10 / (0.1 + Math.random());
      for (var i = 0; i < n; i++) {
        var w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }
  }
}
