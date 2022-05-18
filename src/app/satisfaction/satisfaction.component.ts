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
    
    let subject = "LIFESAT"

    let subjectNames = {"TIMESAT": "Tijdsgebruik",
                        "COMSAT": "Pendelen",
                        "JOBSAT": "Job",
                        "ACCSAT": "Onderdak",
                        "FINSAT":  "Financieel",
                        "MEANLIFE": "Levensnut",
                        "RELSAT": "Relaties",
                        "LIVENVSAT": "Leefomgeving",
                        "GREENSAT": "Recreatieruimtes",
                        "LIFESAT": "Algemeen"
                      }

    let margin = {top: 10, right: 10, bottom: 10, left: 10};
    let width = 1200;
    let height = 500;

    let maleStats = {x: 90, y: height - 50, height: height - 50, width: width/10, color: "#96D6F7"}
    let femaleStats = {x: maleStats.x + maleStats.width * 1.25, y: height - 50, height: height - 50, width: width/10, color: "#FFA500"}

    var textElement = document.getElementById("explanation");


    let svg = d3.select("#satisfaction")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // let text = svg.append("g").append("text").text(`Deze vraag was het uitgangspunt bij het opstellen van deze scroll-through. 
    // Vertrekkende van \n de algmene tevredenheid bij de Belg, zal er eerst gekeken worden naar verschillende soorten tevredenheid.
    //  Om vervolgens te bekijken wat deze tevredenheid al dan niet kan beïnvloeden, zullen enkele aspecten meer in detail gevisualiseerd worden. 
    //  Zo zal in een eerste uitdieping het financiële aspect verder verwerkt worden. Daarnaast zullen mannen en vrouwen vergeleken worden op basis van hoe 
    //  gezond ze zichzelf vinden. Tot slot wordt er nog een kijkje genomen naar de cijfers over depressieve symptomen.
    //   Op deze manier is het hopelijk mogelijk nieuwe inzichten te geven over hoe het met de gemiddelde vrouwelijke en mannelijke Belg gesteld is.`)
    //   .attr("x", 600)
    //   .attr("y", 200)
    //   .attr("width", 400)


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
              let femaleStats2 = {x: maleStats2.x + maleStats2.width * 1.25, y: smallGraphHeight, height:smallGraphHeight, width: smallGraphWidth / 3, color: "#FFA500"}

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

  let colorRatingMale = { low: "#ef8a62", medium: "#e6dddc", high: "#67a9cf"}
  let colorRatingFemale = { low: "#ef8a62", medium: "#e6dddc", high: "#67a9cf"}


  function createDivisionGraph(data, maleStats, femaleStats, focusGraph, subject) {
    focusGraph.selectAll("*").remove()

    var yScale = d3.scaleLinear().range([height - margin.bottom, 40]);
    yScale.domain([0,100]);

    var yAxis = d3.axisLeft(yScale);
    focusGraph.append("g")
        .attr("transform", `translate(${margin.left + 50}, 0)`)
        .call(yAxis);

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
    .attr("height", maleStats.height * mLow)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * mLow)
    .attr("fill", colorRatingMale.low)

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * mMedium)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * mLow - maleStats.y * mMedium)
    .attr("fill", colorRatingMale.medium)

    focusGraph.append("rect")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * mHigh)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y)
    .attr("fill", colorRatingMale.high)

    focusGraph.append("image")
    .attr('xlink:href', "assets/satisfaction/male-icon.png")
    .attr("width", maleStats.width)
    .attr("height", maleStats.height * mMedium)
    .attr("x", margin.left + maleStats.x)
    .attr("y", height - margin.bottom - maleStats.y * mMedium)

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fLow)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * fLow)
    .attr("fill", colorRatingFemale.low)

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fMedium)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * fLow - femaleStats.y * fMedium)
    .attr("fill", colorRatingFemale.medium)

    focusGraph.append("rect")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fHigh)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y)
    .attr("fill", colorRatingFemale.high)

    focusGraph.append("image")
    .attr('xlink:href', "assets/satisfaction/female-icon.png")
    .attr("width", femaleStats.width)
    .attr("height", femaleStats.height * fMedium)
    .attr("x", margin.left + femaleStats.x)
    .attr("y", height - margin.bottom - femaleStats.y * fMedium)

    focusGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width + (femaleStats.x - maleStats.x - maleStats.width) / 2)
    .attr("y", height - margin.bottom - maleStats.height - 30)
    .style("font-size", "30px")
    .text(subjectNames[subject] + " - Scores")
    .attr("fill", "black")

    focusGraph.append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", femaleStats.x + femaleStats.width + 50)
    .attr("y", 50)
    .attr("fill", colorRatingFemale.high)

    focusGraph.append("text")
    .attr("x", femaleStats.x + femaleStats.width + 110)
    .attr("y", 85)
    .style("font-size", "25px")
    .text("Hoog")
    .attr("fill", "black")

    focusGraph.append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", femaleStats.x + femaleStats.width + 50)
    .attr("y", 120)
    .attr("fill", colorRatingFemale.medium)

    focusGraph.append("text")
    .attr("x", femaleStats.x + femaleStats.width + 110)
    .attr("y", 155)
    .style("font-size", "25px")
    .text("Gemiddeld")
    .attr("fill", "black")

    focusGraph.append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .attr("x", femaleStats.x + femaleStats.width + 50)
    .attr("y", 190)
    .attr("fill", colorRatingFemale.low)

    focusGraph.append("text")
    .attr("x", femaleStats.x + femaleStats.width + 110)
    .attr("y", 225)
    .style("font-size", "25px")
    .text("Laag")
    .attr("fill", "black")

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

  function createMainGraph(data, maleStats, femaleStats, focusGraph, subj) {
    focusGraph.selectAll("*").remove()


    subject = subj

    let percMale =  parseFloat(data.map(d => d[subj])[1]) / 10
    let percFemale =  parseFloat(data.map(d => d[subj])[2]) / 10

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
    .attr("fill", "#DCDCDC")

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
    .style("font-size", "50px")
    .text(percMale * 100 + "%")
    .attr("fill", "black")

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
    .attr("fill", "#DCDCDC")

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
    .style("font-size", "50px")
    .text(percFemale * 100 + "%")
    .attr("fill", "black")

    focusGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width + (femaleStats.x - maleStats.x - maleStats.width) / 2)
    .attr("y", height - margin.bottom - maleStats.height - 30)
    .style("font-size", "30px")
    .text(subjectNames[subj] + " - Gemiddelde")
    .attr("fill", "black")
    
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
    .attr("fill", "#DCDCDC")

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
    .style("font-size", "15px")
    .text(percMale * 100 + "%")
    .attr("fill", "black")

    sideGraph.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("x", margin.left + maleStats.x + maleStats.width + (femaleStats.x - maleStats.x - maleStats.width) / 2)
    .attr("y", height - margin.bottom - maleStats.height - maleStats.height / 7)
    .style("font-size", "19px")
    .text(subjectNames[subject])
    .attr("fill", "black")

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
    .attr("fill", "#DCDCDC")

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
    .style("font-size", "15px")
    .text(percFemale * 100 + "%")
    .attr("fill", "black")
}
  }

}