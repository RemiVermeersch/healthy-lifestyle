import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { color } from 'd3';

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
    
    let subject = "TIMESAT"

    let subjectNames = {"TIMESAT": "Tijdsgebruik",
                        "COMSAT": "Pendelen",
                        "JOBSAT": "Job",
                        "ACCSAT": "Onderdak",
                        "FINSAT":  "Financieel",
                        "MEANLIFE": "Levensnut",
                        "RELSAT": "Relaties",
                        "LIVENVSAT": "Leefomgeving",
                        "GREENSAT": "Groene omgeving",
                        "LIFESAT": "Algemeen"
                      }

    let subjectExplanations = {"TIMESAT": "Tijdsgebruik",
                              "COMSAT": "Pendelen",
                              "JOBSAT": "Job",
                              "ACCSAT": "Onderdak",
                              "FINSAT":  "Financieel",
                              "MEANLIFE": "Levensnut",
                              "RELSAT": "Relaties",
                              "LIVENVSAT": "Leefomgeving",
                              "GREENSAT": "Groene omgeving",
                              "LIFESAT": "Algemeen"
 }

    function setFocus(sub) {
      console.log("works as well")
      console.log(sub)
      // subject = sub
      // createMainGraph(data, maleStats, femaleStats, mainFocus, sub)
    }

    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = window.innerWidth;
    let height = window.innerHeight - 150;

    let maleStats = {x: 90, y: height, height: height, width: width/10, color: "#96D6F7"}
    let femaleStats = {x: maleStats.x + maleStats.width * 1.25, y: height, height: height, width: width/10, color: "#F7D4E0"}

    let svg = d3.select("#satisfaction")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let mainFocus = svg.append("g")
      .attr("id", "mainFocus")


    d3.csv("assets/satisfaction/satisfaction-avg.csv").then(function (data) {
 
      let smallGraphWidth = width / 13;
      let smallGraphHeight = height / 5;


      


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
              .attr("data-tip", col)
              .on("click", (e) => {
                console.log(e.target.parentElement.getAttribute("data-tip"));
                createMainGraph(data, maleStats, femaleStats, mainFocus, e.target.parentElement.getAttribute("data-tip"));
              });


              let maleStats2 = {x: 125, y: smallGraphHeight, height: smallGraphHeight, width: smallGraphWidth / 3, color: "#96D6F7"}
              let femaleStats2 = {x: maleStats2.x + maleStats2.width * 1.25, y: smallGraphHeight, height:smallGraphHeight, width: smallGraphWidth / 3, color: "#F7D4E0"}

              createSideGraph(data, maleStats2, femaleStats2, graph1, col);

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
  
  function showDivision() {
      d3.csv("assets/satisfaction/satisfaction-rating.csv").then(function (data) {
        let allSubject = data.filter(d => (d['indic_wb'] == subject))
        
        createDivisionGraph(allSubject, maleStats, femaleStats, mainFocus, subject)
      })
    } 

  function hideDivision() {
    console.log("hover out")
    d3.csv("assets/satisfaction/satisfaction-avg.csv").then(function (data) {
      createMainGraph(data, maleStats, femaleStats, mainFocus, subject)
    })
    }

  let colorRatingMale = { low: "#af8dc3", medium: "#f7f7f7", high: "#7fbf7b"}
  let colorRatingFemale = { low: "#e9a3c9", medium: "#f7f7f7", high: "#a1d76a"}


  function createDivisionGraph(data, maleStats, femaleStats, focusGraph, subject) {
    focusGraph.selectAll("*").remove()

    let male = data.filter(d => (d['sex'] == "M"));
    let mHigh =  male.filter(d => (d['lev_satis'] == "HIGH")).map(d => d['OBS_VALUE']) / 100
    let mMedium =  male.filter(d => (d['lev_satis'] == "MED")).map(d => d['OBS_VALUE']) / 100
    let mLow =  male.filter(d => (d['lev_satis'] == "LOW")).map(d => d['OBS_VALUE']) / 100
    
    let female = data.filter(d => (d['sex'] == "F"));
    let fHigh =  female.filter(d => (d['lev_satis'] == "HIGH")).map(d => d['OBS_VALUE']) / 100
    let fMedium =  female.filter(d => (d['lev_satis'] == "MED")).map(d => d['OBS_VALUE']) / 100
    let fLow =  female.filter(d => (d['lev_satis'] == "LOW")).map(d => d['OBS_VALUE']) / 100

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * mHigh)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * mHigh)
    .attr("fill", colorRatingMale.high)

    // focusGraph.append("text")
    // .attr("text-anchor", "middle")
    // .attr("dominant-baseline", "central")
    // .attr("x", margin.left + maleStats.x + maleStats.width / 2)
    // .attr("y", height - margin.bottom - maleStats.y * mHigh/ 2)
    // .attr("font-size", 200)
    // .text(":)")
    // .attr("rotate", 90)
    // .attr("fill", "black")

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * mMedium)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * mHigh - maleStats.y * mMedium)
    .attr("fill", colorRatingMale.medium)

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * mLow)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", colorRatingMale.low)

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fHigh)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * fHigh)
    .attr("fill", colorRatingFemale.high)

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fMedium)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * fHigh - femaleStats.y * fMedium)
    .attr("fill", colorRatingFemale.medium)

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fLow)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", colorRatingFemale.low)

    focusGraph.append("rect")
      .attr("id", "mainClick")
      .attr("width", maleStats.width * 2.25)
      .attr("height", maleStats.height)
      .attr("x", margin.left + maleStats.x)
      .attr("y", height - margin.bottom - maleStats.y)
      .attr("opacity", 0)

    // document.getElementById("mainClick").addEventListener("mouseover", showDivision)
    document.getElementById("mainClick").addEventListener("mouseout", hideDivision)

  }

  function createMainGraph(data, maleStats, femaleStats, focusGraph, subject) {
    focusGraph.selectAll("*").remove()

    let percMale =  parseFloat(data.map(d => d[subject])[1]) / 10
    let percFemale =  parseFloat(data.map(d => d[subject])[2]) / 10

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * percMale)
    .attr("fill", maleStats.color)

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
    .attr("fill", femaleStats.color)

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
    
    focusGraph.append("rect")
    .attr("id", "mainClick")
    .attr("width", maleStats.width * 2.25)
    .attr("height", maleStats.height)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("opacity", 0)

    document.getElementById("mainClick").addEventListener("mouseover", showDivision)
    // document.getElementById("mainClick").addEventListener("mouseout", hideDivision)
}

function createSideGraph(data, maleStats, femaleStats, sideGraph, subject) {

  let percMale =  parseFloat(data.map(d => d[subject])[1]) / 10
  let percFemale =  parseFloat(data.map(d => d[subject])[2]) / 10

    sideGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * percMale)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * percMale)
    .attr("fill", maleStats.color)

    sideGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * (1-percMale))
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", "black")

    // sideGraph.append("image")
    // .attr('xlink:href', "male-icon.png")
    // .attr("width", maleStats.width)
    // .attr("height", maleStats.height * percMale)
    // .attr("x", margin.left + maleStats.x)
    // .attr("y", height - margin.bottom - maleStats.y * percMale)

    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width / 2)
    .attr("y", height - margin.bottom - maleStats.y * percMale - maleStats.height * (1-percMale) / 2)
    .attr("font-size", 10)
    .text(percMale * 100 + "%")
    .attr("fill", "white")

    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width + (femaleStats.x - maleStats.x - maleStats.width) / 2)
    .attr("y", height - margin.bottom - maleStats.height - maleStats.height / 7)
    .attr("font-size", 10)
    .text(subjectNames[subject])
    .attr("fill", "white")

    sideGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * percFemale)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * percFemale)
    .attr("fill", femaleStats.color)

    sideGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * (1-percFemale))
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", "black")

    // sideGraph.append("image")
    // .attr('xlink:href', "female-icon.png")
    // .attr("width", femaleStats.width)
    // .attr("height", femaleStats.height * percFemale)
    // .attr("x", margin.left + femaleStats.x)
    // .attr("y", height - margin.bottom - femaleStats.y * percFemale)
  
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