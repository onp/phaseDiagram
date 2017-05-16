import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PropertiesService } from './properties.service';
import { IsoplotDataService } from './isoplot-data.service';
import { PropertySpace } from './property-space'

import * as d3 from 'd3';

declare var Module:any;

@Component({
  selector: 'isobar-plot',
  template: ``,
  encapsulation: ViewEncapsulation.None,
  styleUrls:["./plot.component.css"],
  providers: [IsoplotDataService,PropertiesService]
})
export class IsobarPlotComponent implements OnInit{

  constructor(
    private isoplotDataService: IsoplotDataService,
    private propertiesService: PropertiesService
  ) { }

  ngOnInit(): void {
    this.createPlot();
  }

  createPlot(): void {
    let xSize = 960;
    let ySize = 500;
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = xSize - margin.left - margin.right;
    let height = ySize - margin.top - margin.bottom;

    let bthis = this;

    let svg = d3.select("isobar-plot")
                .append("div")
                .classed("svg-container", true) //container class to make it responsive
                .append("svg")
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${xSize} ${ySize}`)
                //class to make it responsive
                .classed("svg-content-responsive", true);

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLog().range([height, 0]);

    let line = d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d: any) { return x(d.x); })
                 .y(function(d: any) { return y(d.y); });

    let pressureSpace = new PropertySpace("P",  1.5e2, 1e10, 50, "log");
    let enthalpySpace = new PropertySpace("H", -1e6, 1.2e6);

    let tdata = this.isoplotDataService.createData(new PropertySpace("T",  100,  600, 15, "linear"),
                                                   enthalpySpace, pressureSpace);
    let ddata = this.isoplotDataService.createData(new PropertySpace("D",  0.1, 1000, 10, "log"),
                                                   enthalpySpace, pressureSpace);
    let edata = this.isoplotDataService.createData(new PropertySpace("S", -2000, 7000, 10, "linear"),
                                                   enthalpySpace, pressureSpace);

    let phasedata = this.isoplotDataService.createPhaseData(enthalpySpace,
                                                            new PropertySpace("P",  1.5e2, 1e10, 200, "log"));

    let isotherms = d3.nest()         // Constant Temperature
                     .key(function(d:any) { return d.iso; })
                     .entries(tdata);

    let isopycnals = d3.nest()       // Constant Density
                      .key(function(d:any) { return d.iso; })
                      .entries(ddata);

    let isentropes = d3.nest()      // Constant Entropy
                      .key(function(d:any) { return d.iso; })
                      .entries(edata);

    let isophase = d3.nest()      // Phase Lines
                      .key(function(d:any) { return d.iso; })
                      .entries(phasedata);

    x.domain(d3.extent(tdata, function(d:any) { return d.x; }));
    y.domain(d3.extent(tdata, function(d:any) { return d.y; }));

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
      .attr("stroke", "blue")
      .attr("fill", "none");

    isotherm.append("path")
      .attr("class", "line")
      .attr("d", function(d) {return line(d.values); })

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

    let phasebound = g.selectAll(".phase")
    .data(isophase)
    .enter().append("g")
      .attr("class", "phase")
      .attr("stroke", "black")
      .attr("fill", "none");

    phasebound.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })

    let focus = g.append("g")
        .attr("class","focus");
      focus.append("line")
        .attr("id", "xLine")
      focus.append("line")
        .attr("id", "yLine");

    g.append("rect")
      .attr('class', 'overlay')
      .attr('width', xSize)
      .attr('height', ySize)
      .on('mousemove', function(){
        let mouse = d3.mouse(d3.event.currentTarget);
        let xCoord = x.invert(mouse[0]);
        let yCoord = y.invert(mouse[1]);

        //console.log(xCoord, yCoord);
        //console.log(bthis.propertiesService.ethylene("T", "P", yCoord, "H", xCoord));

        focus.select("#xLine")
          .attr("x1", mouse[0]).attr("y1", y.range()[0])
          .attr("x2", mouse[0]).attr("y2", y.range()[1])
        focus.select("#yLine")
          .attr("x1", x.range()[0]).attr("y1", mouse[1])
          .attr("x2", x.range()[1]).attr("y2", mouse[1])


      })

  }
}
