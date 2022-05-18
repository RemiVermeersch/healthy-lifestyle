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
    this.createChart2();
  }

  

  

  createChart2() {

    function showDivision() {
      console.log("works")
    } 

    function setFocus() {
      console.log("works as well")
    }

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
      .attr("id", "mainFocus")

    document.getElementById("mainFocus").addEventListener("click", showDivision)

    d3.csv("assets/satisfaction/satisfaction-avg.csv").then(function (data) {
 
      let smallGraphWidth = width / 5;
      let smallGraphHeight = height / 5;

      let maleStats = {x: 100, y: height, height: height, width: 200}
      let femaleStats = {x: maleStats.x + maleStats.width * 1.25, y: height, height: height, width: 200}

      let subject = "financial"

      createMainGraph(data, maleStats, femaleStats, mainFocus, subject);

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
              .attr("id", col)

              document.getElementById(col).addEventListener("click", setFocus);


              maleStats = {x: 200, y: smallGraphHeight, height: smallGraphHeight, width: 50}
              femaleStats = {x: maleStats.x + maleStats.width * 1.25, y: smallGraphHeight, height:smallGraphHeight, width: 50}

              createSideGraph(data, maleStats, femaleStats, graph1, col);

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
  

  function createMainGraph(data, maleStats, femaleStats, focusGraph, subject) {

    let percMale =  parseFloat(data.map(d => d[subject])[1]) / 10
    let percFemale =  parseFloat(data.map(d => d[subject])[2]) / 10

    console.log("hello")
    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * percMale)
    .attr("fill", "blue")

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * (1-percMale))
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", "black")

    focusGraph.append("image")
    .attr('xlink:href', "assets/satisfaction/male-icon.png")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * percMale)

    focusGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width / 2)
    .attr("y", height - margin.bottom - maleStats.y * percMale - maleStats.height * (1-percMale) / 2)
    .attr("font-size", 70)
    .text(percMale * 100 + "%")
    .attr("fill", "white")


    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale)
    .attr("fill", "orange")

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * (1-percFemale))
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", "black")

    focusGraph.append("image")
    .attr('xlink:href', "assets/satisfaction/female-icon.png")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale)
  
    focusGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + femaleStats.x + femaleStats.width / 2)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale - femaleStats.height * (1-percFemale) / 2)
    .attr("font-size", 70)
    .text(percFemale * 100 + "%")
    .attr("fill", "white")
}

function createSideGraph(data, maleStats, femaleStats, sideGraph, subject) {

  let percMale =  parseFloat(data.map(d => d[subject])[1]) / 10
  let percFemale =  parseFloat(data.map(d => d[subject])[2]) / 10

    sideGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * percMale)
    .attr("fill", "blue")

    sideGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * (1-percMale))
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", "black")

    sideGraph.append("image")
    .attr('xlink:href', "male-icon.png")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * percMale)

    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width / 2)
    .attr("y", height - margin.bottom - maleStats.y * percMale - maleStats.height * (1-percMale) / 2)
    .attr("font-size", 10)
    .text(percMale * 100 + "%")
    .attr("fill", "white")

    sideGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale)
    .attr("fill", "orange")

    sideGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * (1-percFemale))
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", "black")

    sideGraph.append("image")
    .attr('xlink:href', "female-icon.png")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale)
  
    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + femaleStats.x + femaleStats.width / 2)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale - femaleStats.height * (1-percFemale) / 2)
    .attr("font-size", 10)
    .text(percFemale * 100 + "%")
    .attr("fill", "white")
}
  }

}