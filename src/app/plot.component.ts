import { Component, OnInit } from '@angular/core';

import { PropertiesService } from './properties.service';

import * as d3 from 'd3';

declare var Module:any;

@Component({
  selector: 'isobar-plot',
  template: `
    <svg width="960" height="500"></svg>
  `,
  providers: [PropertiesService]
})
export class IsobarPlotComponent implements OnInit{

  constructor(
    private propertiesService: PropertiesService
  ) { }

  ngOnInit(): void {
    this.createPlot();
  }

  createDataEnth(): {t:number, p:number, h:number}[] {
    let dat: {t:number, p:number, h:number}[] = [];
    for(let temp=100; temp<600; temp+=20){
      for(let pres=1e2; pres<1e10; pres*=1.7){
        let enth = this.propertiesService.ethylene("H", "P", pres, "T", temp)
        if (isFinite(enth) && enth<1.2e6){
          dat.push({t:temp, p:pres, h:enth});
        }
      }
    }
    return dat
  }

  createDataDens(): {d:number, p:number, h:number}[] {
    let dat: {d:number, p:number, h:number}[] = [];
    for(let dens=0.01; dens<1000; dens*=2){
      for(let pres=1e2; pres<1e10; pres*=1.7){
        let enth = this.propertiesService.ethylene("H", "P", pres, "D", dens)
        if (isFinite(enth) && enth<1.2e6){
          dat.push({d:dens, p:pres, h:enth});
        }
      }
    }
    return dat
  }

  createDataEntr(): {e:number, p:number, h:number}[] {
    let dat: {e:number, p:number, h:number}[] = [];
    for(let entr=-2000; entr<7000; entr+=400){
      for(let pres=1e2; pres<1e10; pres*=1.7){
        let enth = this.propertiesService.ethylene("H", "P", pres, "S", entr)
        if (isFinite(enth) && enth<1.2e6){
          dat.push({e:entr, p:pres, h:enth});
        }
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
    let y = d3.scaleLog().range([height, 0])

    let line = d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d: any):number { return x(d.h); })
                 .y(function(d: any) { return y(d.p); })

    let data = this.createDataEnth()
    let ddata = this.createDataDens()
    let edata = this.createDataEntr()

    let isotherms = d3.nest()
                      .key(function(d:any) { return d.t; })
                      .entries(data);

    let isopycnals = d3.nest()
                      .key(function(d:any) { return d.d; })
                      .entries(ddata);

    let isentropes = d3.nest()
                      .key(function(d:any) { return d.e; })
                      .entries(edata);


    x.domain(d3.extent(data, function(d:any) { return d.h; }));
    y.domain(d3.extent(data, function(d:any) { return d.p; }));

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
      .text("Pressure, Pa-a");

    let isotherm = g.selectAll(".isotherm")
    .data(isotherms)
    .enter().append("g")
      .attr("class", "isotherm")
      .attr("stroke", "black")
      .attr("fill", "none");

    isotherm.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })

    let isopycnal = g.selectAll(".isopycnal")
    .data(isopycnals)
    .enter().append("g")
      .attr("class", "isopycnal")
      .attr("stroke", "red")
      .attr("fill", "none");

    isopycnal.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })

    let isentrope = g.selectAll(".isentrope")
    .data(isentropes)
    .enter().append("g")
      .attr("class", "isentrope")
      .attr("stroke", "green")
      .attr("fill", "none");

    isentrope.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })


  }
}
