import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-satisfaction',
  templateUrl: './satisfaction.component.html',
  styleUrls: ['./satisfaction.component.less']
})
export class SatisfactionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  

  createChart() {

    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = window.innerWidth;
    let height = window.innerHeight - 50;

    let svg = d3.select("#satisfaction")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let mainFocus = svg.append("g")

    d3.csv("assets/satisfaction/satisfaction-avg.csv").then(function (data) {
 
      let smallGraphWidth = width / 5;
      let smallGraphHeight = height / 5;

      let maleStats = {x: 100, y: height, height: height, width: 200, percMale:  parseFloat(data.map(d => d["financial"])[1]) / 10}
      let femaleStats = {x: maleStats.x + maleStats.width * 1.25, y: height, height: height, width: 200, percFemale: parseFloat(data.map(d => d["financial"])[2]) / 10}

      createMainGraph(data, maleStats, femaleStats, mainFocus);

      var offsetX = 500;
      var offsetY = 0;
      var count = 0;
      var labels = data.columns.slice(1,11);
      labels = labels.slice(1,labels.length)
      console.log(labels)

      for (var col of data.columns) {
          if (col != "labels") {
              let graph1 = svg.append("g")
              .attr("transform",
              "translate(" + offsetX + "," + offsetY + ")")


              maleStats = {x: 200, y: smallGraphHeight, height: smallGraphHeight, width: 50, percMale: parseFloat(data.map(d => d[col])[1]) / 10}
              femaleStats = {x: maleStats.x + maleStats.width * 1.25, y: smallGraphHeight, height:smallGraphHeight, width: 50, percFemale: parseFloat(data.map(d => d[col])[2]) / 10}

              createSideGraph(data, maleStats, femaleStats, graph1);

              if (count == 4) {
                  offsetX = 500;
                  offsetY = - smallGraphHeight - 50
              }
              else {
                  offsetX += 150;
              }
              count++
          }
      }
    })
  

  function createMainGraph(data, maleStats, femaleStats, focusGraph) {

    console.log("hello")
    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * maleStats.percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * maleStats.percMale)
    .attr("fill", "blue")

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * (1-maleStats.percMale))
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", "black")

    focusGraph.append("image")
    .attr('xlink:href', "assets/satisfaction/male-icon.png")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * maleStats.percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * maleStats.percMale)

    focusGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width / 2)
    .attr("y", height - margin.bottom - maleStats.y * maleStats.percMale - maleStats.height * (1-maleStats.percMale) / 2)
    .attr("font-size", 70)
    .text(maleStats.percMale * 100 + "%")
    .attr("fill", "white")


    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * femaleStats.percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * femaleStats.percFemale)
    .attr("fill", "orange")

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * (1-femaleStats.percFemale))
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", "black")

    focusGraph.append("image")
    .attr('xlink:href', "assets/satisfaction/female-icon.png")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * femaleStats.percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * femaleStats.percFemale)
  
    focusGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + femaleStats.x + femaleStats.width / 2)
    .attr("y", height - margin.bottom - femaleStats.y * femaleStats.percFemale - femaleStats.height * (1-femaleStats.percFemale) / 2)
    .attr("font-size", 70)
    .text(femaleStats.percFemale * 100 + "%")
    .attr("fill", "white")
}

function createSideGraph(data, maleStats, femaleStats, sideGraph) {

    sideGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * maleStats.percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * maleStats.percMale)
    .attr("fill", "blue")

    sideGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * (1-maleStats.percMale))
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", "black")

    sideGraph.append("image")
    .attr('xlink:href', "male-icon.png")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * maleStats.percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * maleStats.percMale)

    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width / 2)
    .attr("y", height - margin.bottom - maleStats.y * maleStats.percMale - maleStats.height * (1-maleStats.percMale) / 2)
    .attr("font-size", 10)
    .text(maleStats.percMale * 100 + "%")
    .attr("fill", "white")

    sideGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * femaleStats.percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * femaleStats.percFemale)
    .attr("fill", "orange")

    sideGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * (1-femaleStats.percFemale))
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", "black")

    sideGraph.append("image")
    .attr('xlink:href', "female-icon.png")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * femaleStats.percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * femaleStats.percFemale)
  
    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + femaleStats.x + femaleStats.width / 2)
    .attr("y", height - margin.bottom - femaleStats.y * femaleStats.percFemale - femaleStats.height * (1-femaleStats.percFemale) / 2)
    .attr("font-size", 10)
    .text(femaleStats.percFemale * 100 + "%")
    .attr("fill", "white")
}
  }

}