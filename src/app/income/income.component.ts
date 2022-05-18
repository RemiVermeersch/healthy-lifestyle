import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.less']
})
export class IncomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //this.createChartIncome();
    //this.createDad();
    this.createIncomeEvolution();
  }

  createDad() {
    // set the dimensions and margins of the graph
    const margin = { top: 200, right: 50, bottom: 200, left: 50 },
      width = 700 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom,
      innerRadius = 50,
      outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    const svg = d3.select("#income")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2 + 100})`); // Add 100 on Y translation, cause upper bars are longer

    d3.csv("assets/income/meanEarnings2018.csv").then(function (data) {

      // X scale
      const x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?
        .domain(data.map(d => d['Industry'])); // The domain of the X axis is the list of states.

      // Y scale
      const y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 4000]); // Domain of Y is from 0 to the max seen in the data

      // Add bars
      svg.append("g")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", "#69b3a2")
        .attr("d", <any>d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d['Total']))
          .startAngle(d => x(d['Industry']))
          .endAngle(d => x(d['Industry']) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))

      // Add the labels
      svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("text-anchor", function (d) { return (x(d['Industry']) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) { return "rotate(" + ((x(d['Industry']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(Number(d['Total'])) + 10) + ",0)"; })
        .append("text")
        .text(function (d) { return (d['Industry']) })
        .attr("transform", function (d) { return (x(d['Industry']) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")


      console.log("patat")
    });

  }

  /*function lineChart(data) {
    var data = [
      { year: 2006, category: "Industrie", sex: "Both" ,spending: 2438 },
      { year: 2010, media: "Business economie", spending: 2749 },
      { year: 2014, media: "Digital", spending: 2956 },
      { year: 2018, media: "Industrie en constructie", spending: 3360 },
      { year: 2006, media: "Services van business economie", spending: 142.23 },
      { year: 2010, media: "Onderwijs, sociaal werk,...", spending: 156.43 },

      { year: 2010, media: "Business economie", spending: 2749 },
      { year: 2014, media: "Digital", spending: 2956 },
      { year: 2018, media: "Industrie en constructie", spending: 3360 },
      { year: 2006, media: "Services van business economie", spending: 142.23 },
      { year: 2010, media: "Onderwijs, sociaal werk,...", spending: 156.43 },

  ];

  }*/

  createIncomeEvolution() {
    // set the dimensions and margins of the graph
    let margin = { top: 10, right: 30, bottom: 30, left: 60 };
    let width = 460 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#year")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv("assets/income/monthlyIncome.csv").then(function (data: any) {

      let incomes = [];
      for (var i = 0; i < data.length; i++) {
        incomes[data[i].Industry] = {
          "Total2006": { value: data[i].Total2006, year: 2006 },
          "Total2010": { value: data[i].Total2010, year: 2010 },
          "Total2014": { value: data[i].Total2014, year: 2014 },
          "Total2018": { value: data[i].Total2018, year: 2018 },
          "Male2006": { value: data[i].Male2006, year: 2006 },
          "Male2010": { value: data[i].Male2010, year: 2010 },
          "Male2014": { value: data[i].Male2014, year: 2014 },
          "Male2018": { value: data[i].Male2018, year: 2018 },
          "Female2006": { value: data[i].Female2006, year: 2006 },
          "Female2010": { value: data[i].Female2010, year: 2010 },
          "Female2014": { value: data[i].Female2014, year: 2014 },
          "Female2018": { value: data[i].Female2018, year: 2018 },
        }
      }
      console.log(incomes);

      //let sumstat = d3.group(incomes, d => d[]); // nest function allows to group the calculation per level of a factor
      //console.log(sumstat);
      // Add X axis --> it is a date format
      const x = d3.scaleLinear()
        .domain([2006, 2018])
        .range([0, width]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(6));

      d3.axisBottom(x).ticks(d3.timeYear.every(4));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 4000])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // color palette
      const color = d3.scaleOrdinal()
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
      console.log(incomes["Business economy"])
      // Draw the line
      svg.selectAll(".line")
        .data(incomes["Business economy"])
        .join("path")
        .attr("fill", "none")
        .attr("stroke", '#377eb8')
        .attr("stroke-width", 1.5)
        .attr("d", function (d : any) {
          return d3.line()
            .x(function (d : any) { return x(d.year); })
            .y(function (d : any) { return y(d.value); })
            (d[1])
        })
    })

  }

}



/*d3.csv("assets/meanEarnings2018.csv").then( (data) => {
  console.log("lol")
});*/