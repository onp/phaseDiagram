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

  ngOnInit(): void {
    this.createPlot();
  }

  createData(): {temperature:number, density:number, pressure:number}[] {
    let dat: {temperature:number,
              density:number,
              pressure:number}[]=[{temperature:10, density:10, pressure:10}];
    for(let temp=100; temp<500; temp=temp+100){
      for(let dens=10; dens<500; dens=dens+10){
        dat.push({temperature:temp,
                  density:dens,
                  pressure:this.ethyleneService.pressure_dt(dens,temp)});
      }
    }
    return dat
  }

  createPlot(): void {
    let svg = d3.select("svg");
    let margin = {top: 20, right: 80, bottom: 30, left: 50};
    let width = +svg.attr("width") - margin.left - margin.right;
    let height = +svg.attr("height") - margin.top - margin.bottom;
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear().range([0, width])
    let y = d3.scaleLinear().range([0, height])

    let line = d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d: any):number { return x(d.density); })
                 .y(function(d: any) { return y(d.pressure); })

    let data = this.createData()

    let isotherms = d3.nest()
                      .key(function(d:any) { return d.temperature; })
                      .entries(data);

    x.domain(d3.extent(data, function(d:any) { return d.density; }));
    y.domain(d3.extent(data, function(d:any) { return d.pressure; }));
    console.log(y.domain())

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Pressure, kPa-a");

    console.log(isotherms)
    console.log(data)

    let isotherm = g.selectAll(".isotherm")
    .data(isotherms)
    .enter().append("g")
      .attr("class", "isotherm")
      .attr("stroke", "black")
      .attr("fill", "none");

    isotherm.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })


  }
}
