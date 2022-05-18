import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {flatMap} from "rxjs";

@Component({
  selector: 'app-depression',
  templateUrl: './depression.component.html',
  styleUrls: ['./depression.component.less']
})
export class DepressionComponent implements OnInit {

  radius = 5;
  padding = 1;
  cluster_padding = 5;
  pad_left = 200;
  age_data;

  ages = ["Y15-24", "Y25-34", "Y35-44", "Y45-54", "Y55-64", "Y65-74", "Y_GE75"]

  nodes;
  ngOnInit(): void {

    d3.csv("/assets/depression/depression_be.csv").then( (data) => {
      this.age_data = this.parse_age_data(data)
      this.generate_spider(this.age_data)

    })
  }

  parse_age_data(data) {
    let ages = ["Y15-24", "Y25-34", "Y35-44", "Y45-54", "Y55-64", "Y65-74", "Y_GE75"]
    let data_total_ed = data.filter(function(d, i) { return d.isced11 == "TOTAL" && ages.indexOf(d.age) >= 0})
    let data_filter_columns = data_total_ed.map(function(d) {
      return {
        sex: d.sex,
        age: d['age'],
        value: d['OBS_VALUE']
      }
    })
    return d3.group(data_filter_columns, d => d['sex'])
  }

  generate_spider(age_data) {
    let data_array = [age_data.get("F"), age_data.get("M")]

    let hc_data = [
      [ // Women
        { axis: "Y15-24", v: "9.6" },
        { axis: "Y25-34", v: "9.4" },
      { axis: "Y35-44", v: "10.2" },
      { axis: "Y45-54", v: "13" },
      { axis: "Y55-64", v: "10.1" },
      { axis: "Y65-74", v: "8.7" },
      { axis: "Y_GE75", v: "5.9" }
      ],
      [ //Men
        { axis: "Y15-24", v: "5.7" },
      { axis: "Y25-34", v: "5.9" },
      { axis: "Y35-44", v: "10.2" },
      { axis: "Y45-54", v: "6.8" },
      { axis: "Y55-64", v: "9.4" },
      { axis: "Y65-74", v: "3.9" },
      { axis: "Y_GE75", v: "6.4" }
      ]
      ]

    let margin = {top: 100, right: 100, bottom: 100, left: 100}
    let width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right
    let height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    let color = ["#EDC951","#CC333F","#00A0B0"];

    let radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color
    }
    this.radarChart(".radarChart", hc_data, radarChartOptions)
  }

  radarChart(id, data, options) {
    let cfg = {
      w: 600,				//Width of the circle
      h: 600,				//Height of the circle
      margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
      levels: 2,				//How many levels or inner circles should there be drawn
      maxValue: 0, 			//What is the value that the biggest circle will represent
      labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35, 	//The opacity of the area of the blob
      dotRadius: 4, 			//The size of the colored circles of each blog
      opacityCircles: 0.1, 	//The opacity of the circles of each blob
      strokeWidth: 2, 		//The width of the stroke around each blob
      roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
      color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };

    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
      }//for i
    }//if

    let maxValue = 13
    console.log(maxValue)

    let allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
      Format = d3.format('%'),			 	//Percentage formatting
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    let svg = d3.select(id).append("svg")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar"+id);
    //Append a g element
    let g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id','glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
      .data(d3.range(1,(cfg.levels+1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function(d, i){return radius/cfg.levels*d;})
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1,(cfg.levels+1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function(d){return -d*radius/cfg.levels;})
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(function(d,i) { return Format(maxValue * d/cfg.levels * 0.01); });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Scale for the radius
    let rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    //Create the straight lines radiating outward from the center
    let axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    var radarLine = d3.lineRadial()
      .radius((d:any) => rScale(d.v))
      .angle(function(d,i) {	return i*angleSlice; });

    //Create a wrapper for the blobs
    var blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function(d:any,i) { return radarLine(d); })
      .style("fill", function(d,i) { return cfg.color[i]; })
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function (d,i){
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.7);
      })
      .on('mouseout', function(){
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });

    //Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function(d:any,i) { return radarLine(d); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", function(d,i) { return cfg.color[i]; })
      .style("fill", "none")
      .style("filter" , "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data((d:any) => d)
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function(d:any,i){
        console.log(d)
        console.log(i)
        console.log(rScale(d.v))
        console.log(rScale(d.v) * Math.cos(angleSlice*i - Math.PI/2))
        return rScale(d.v) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("cy", function(d:any,i){ return rScale(d.v) * Math.sin(angleSlice*i - Math.PI/2); })
      .style("fill", function(d,i,j) { return cfg.color[i]; })
      .style("fill-opacity", 0.8);


  }//RadarChart


}
