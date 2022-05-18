import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Options } from '@angular-slider/ngx-slider';
import d3Tip from "d3-tip"

@Component({
  selector: 'app-self-percieved-health',
  templateUrl: './self-percieved-health.component.html',
  styleUrls: ['./self-percieved-health.component.less']
})
export class SelfPercievedHealthComponent implements OnInit {

  radius = 5;
  padding = 1;
  cluster_padding = 5;
  pad_left = 200;

  male_counts;
  female_counts;
  barchart;

  ageFilter="Y16-24";
  
  value: number = 1;
  options: Options = {
    floor: 16,
    ceil: 65,
    showTicksValues: true,

    stepsArray: [
      {value: 1, legend: '16-24'},
      {value: 2, legend: '25-34'},
      {value: 3, legend: '35-44'},
      {value: 4, legend: '45-54'},
      {value: 5, legend: '55-65'},
      {value: 6, legend: '65+'}

    ]  };

  nodes;
  data;
  svg;

  clickBubble(){
    document.getElementById("chart").classList.add("visible");
    document.getElementById("chart").classList.remove("invisible");

    document.getElementById("bar_chart").classList.add("invisible");
    document.getElementById("bar_chart").classList.remove("visible");

  }

  clickBar(){
    document.getElementById("chart").classList.add("invisible");
    document.getElementById("chart").classList.remove("visible");

    document.getElementById("bar_chart").classList.add("visible");
    document.getElementById("bar_chart").classList.remove("invisible");
  }

  age_changed(){
    let prev_filter = this.ageFilter;
    if(this.value==1)
      this.ageFilter = "Y16-24";
    if(this.value==2)
      this.ageFilter = "Y25-34";
    if(this.value==3)
      this.ageFilter = "Y35-44";
    if(this.value==4)
      this.ageFilter = "Y45-54";
    if(this.value==5)
      this.ageFilter = "Y55-64";
    if(this.value==6)
      this.ageFilter = "Y65-74";

    this.update_graph(prev_filter);

    this.male_counts = {"very good":groups["very_good_M"].cnt,
      "good":groups["good_M"].cnt,
      "fair":groups["fair_M"].cnt,
      "bad":groups["bad_M"].cnt,
      "very bad":groups["very_bad_M"].cnt
    };
    this.female_counts = {"very good":groups["very_good_F"].cnt,
      "good":groups["good_F"].cnt,
      "fair":groups["fair_F"].cnt,
      "bad":groups["bad_F"].cnt,
      "very bad":groups["very_bad_F"].cnt
    };

    this.update_bar();
  }

  update_bar() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x0 = d3.scaleBand().range([0,width-margin.left-margin.right]).padding(0.2);
    var x1 = d3.scaleBand().range([0,40]);
    var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);
    yScale.domain([0,100]);

    var xAxis = d3.axisBottom(x0).tickSize(0)
    var yAxis = d3.axisLeft(yScale);

    let xDomain = ["very good","good","fair","bad","very bad"];
    let x1Domain = ["M","F"]
    this.male_counts = {"very good":groups["very_good_M"].cnt,
                       "good":groups["good_M"].cnt,
                       "fair":groups["fair_M"].cnt,
                       "bad":groups["bad_M"].cnt,
                       "very bad":groups["very_bad_M"].cnt
                      };
    this.female_counts = {"very good":groups["very_good_F"].cnt,
                      "good":groups["good_F"].cnt,
                      "fair":groups["fair_F"].cnt,
                      "bad":groups["bad_F"].cnt,
                      "very bad":groups["very_bad_F"].cnt
                     };
    x0.domain(xDomain);
    x1.domain(x1Domain);
  
    let totalMargin = margin.top+margin.bottom

    var slice = this.barchart.selectAll("g.g");
    
    slice.selectAll(".bar1")
      .data( x => [this.female_counts[x]])
      .join("rect")
      .transition()
      .duration(1000)
      .attr("width", 15)
      .attr("class","bar1")
      .attr("x", (d:any) => { return x1("M")+45; })
      .style("fill", "#F7D4E0")
      .attr("y", (d)=>(yScale(d)+totalMargin))
      .attr("height", (d:any) =>  height-totalMargin-yScale(d))

    slice.selectAll(".bar2")
      .data( x => [this.male_counts[x]])
      .join("rect")
      .transition()
      .duration(1000)
      .attr("width", 15)
      .attr("class","bar2")
      .attr("x", (d:any) => { return x1("F")+45; })
      .style("fill", "#96D6F7" )
      .attr("y", (d)=>(yScale(d)+totalMargin))
      .attr("height", (d:any) =>  height-totalMargin-yScale(d));
  }
  

  update_graph(old:string){
    let filtered = this.data.filter( x => x.age == this.ageFilter)

    let tempValues = {};
    let correction = {};

    for(let i=0; i<filtered.length; i++){
      let nmbr_of_people = Math.round(parseFloat(filtered[i].OBS_VALUE));
      let groupName = this.parseGroup(filtered[i].sex, filtered[i].levels);
      tempValues[groupName] = groups[groupName].cnt;
      groups[groupName].cnt = nmbr_of_people;
    }

    let genders = ["M","F"];
    //Do this for Male, then Female
    for(let gender in genders){
      let g = genders[gender];
      /**
       * Very good count
       */
      let dif = tempValues["very_good_"+g]-groups["very_good_"+g].cnt;

      //If old val > new val, move all to GOOD, else get them nodes from GOOD
      if(dif>0){
        this.moveNodes("very_good_"+g,"good_"+g,dif);
        tempValues["very_good_"+g]-=dif;
        tempValues["good_"+g]+=dif;
      }else{
        dif = Math.abs(dif)
        this.moveNodes("good_"+g,"very_good_"+g,dif);
        tempValues["good_"+g]-=dif;
        tempValues["very_good_"+g]+=dif;
      }

      // correction when 'good' group doesn't have enough nodes
      correction["good_"+g]=tempValues["good_"+g];
      
      /**
       * Good count
       * current count of Good is the nodes that were there +- the amount that was taken/added in prev step
       */
      dif = tempValues["good_"+g]-groups["good_"+g].cnt;

      if(dif>0){
        this.moveNodes("good_"+g,"fair_"+g, dif);
        tempValues["good_"+g]-=dif;
        tempValues["fair_"+g]+=dif;
      }else{
        dif = Math.abs(dif)
        this.moveNodes("fair_"+g,"good_"+g,dif);
        tempValues["good_"+g]+=dif;
        tempValues["fair_"+g]-=dif;
      }

      correction["fair_"+g]=tempValues["fair_"+g];

      /**
       * fair count, same principle
       */
        dif = tempValues["fair_"+g]-groups["fair_"+g].cnt;

        if(dif>0){
          this.moveNodes("fair_"+g,"bad_"+g,dif);
          tempValues["fair_"+g]-=dif;
          tempValues["bad_"+g]+=dif;
        }else{
          dif = Math.abs(dif)
          this.moveNodes("bad_"+g,"fair_"+g,dif);
          tempValues["fair_"+g]+=dif;
          tempValues["bad_"+g]-=dif;
        }

      correction["bad_"+g]=tempValues["bad_"+g];
      
      /**
       * bad & very bad count, same principle
       */
      dif = tempValues["bad_"+g]-groups["bad_"+g].cnt;

      if(dif>0){
        this.moveNodes("bad_"+g,"very_bad_"+g, dif);
        tempValues["bad_"+g]-=dif;
        tempValues["very_bad_"+g]+=dif;
      }else{
        dif = Math.abs(dif)
        this.moveNodes("very_bad_"+g,"bad_"+g,dif);
        tempValues["bad_"+g]+=dif;
        tempValues["very_bad_"+g]-=dif;
      }
  
      

      if(correction["good_"+g]<0){
        this.moveNodes("good_"+g,"very_good_"+g,Math.abs(correction["good_"+g]));
      }
      if(correction["fair_"+g]<0){
        this.moveNodes("fair_"+g,"good_"+g,Math.abs(correction["fair_"+g]));
      }
      if(correction["bad_"+g]<0){
        this.moveNodes("bad_"+g,"fair_"+g,Math.abs(correction["bad_"+g]));
      }
    }



    this.svg.selectAll('.grpcnt').text(d => groups[d].cnt);


  }

  moveNodes(from, to, amount){
    let nodes = this.nodes.filter(x => x.group == from).slice(0,amount);
    nodes.forEach(element => {
      element.group = to;
    });
  }

  ngOnInit(): void {
    d3.csv("assets/data/self_p_health.csv").then( (data) => {
      this.data = data;
      this.generate_people(data);
      this.createGraph();
      this.createBarChart();
    })
  }

  createBarChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x0 = d3.scaleBand().range([0,width-margin.left-margin.right]).padding(0.2);
    var x1 = d3.scaleBand().range([0,40]);
    var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);
    yScale.domain([0,100]);

    var xAxis = d3.axisBottom(x0).tickSize(0)
    var yAxis = d3.axisLeft(yScale);

    let xDomain = ["very good","good","fair","bad","very bad"];
    let x1Domain = ["M","F"]
    this.male_counts = {"very good":groups["very_good_M"].cnt,
                       "good":groups["good_M"].cnt,
                       "fair":groups["fair_M"].cnt,
                       "bad":groups["bad_M"].cnt,
                       "very bad":groups["very_bad_M"].cnt
                      };
    this.female_counts = {"very good":groups["very_good_F"].cnt,
                      "good":groups["good_F"].cnt,
                      "fair":groups["fair_F"].cnt,
                      "bad":groups["bad_F"].cnt,
                      "very bad":groups["very_bad_F"].cnt
                     };
    x0.domain(xDomain);
    x1.domain(x1Domain);

    this.barchart = d3.select('#bar_chart').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin","auto")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  


    this.barchart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    let totalMargin = margin.top+margin.bottom
    this.barchart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0," + totalMargin + ")")
      .call(yAxis)

    var tip = d3Tip()
    tip
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        console.log(d.toElement.getBoundingClientRect().left);
        return `<span style='position:absolute; left:${d.toElement.getBoundingClientRect().left}px;top:${d.toElement.getBoundingClientRect().top-50}px'>` + d.toElement.getAttribute("data-val") + "</span>";
      });

    this.barchart.call(tip)
    

      
    var slice = this.barchart.selectAll(".slice")
      .data(xDomain)
      .enter()
      .append("g")
      .attr("class", "g")
      .attr("transform",(d) => { return "translate(" + x0(d) + ",0)"; });

    
    slice.selectAll(".bar1")
      .data( x => [this.female_counts[x]])
      .join("rect")
      .attr("width", 15)
      .attr("class","bar1")
      .attr("data-val", d => d)
      .attr("x", (d:any) => { return x1("M")+45; })
      .style("fill", "#F7D4E0")
      .attr("y", (d)=>(yScale(d)+totalMargin))
      .attr("height", (d:any) =>  height-totalMargin-yScale(d))
      .on("mouseover", d => tip.show(d))
      .on("mouseout", d => tip.hide(d))
      .transition()
      .duration(1000);

    slice.selectAll(".bar2")
      .data( x => [this.male_counts[x]])
      .join("rect")
      .attr("width", 15)
      .attr("class","bar2")
      .attr("data-val", (d) => {return d})
      .attr("x", (d:any) => { return x1("F")+45; })
      .style("fill", "#96D6F7" )
      .attr("y", (d)=>(yScale(d)+totalMargin))
      .attr("height", (d:any) =>  height-totalMargin-yScale(d))
      .on('mouseover', d => tip.show(d))
      .on("mouseout", d => tip.hide(d))
      .transition()
      .duration(1000);

      

  }

  createGraph(){
    this.svg = d3.select("#chart")
                  .append("svg")
                  .style("margin","auto")
                  .attr("width", width + 20 + 20)
                  .attr("height", height + 20 + 20)
                  .append("g")
                  .attr("transform", "translate(" + 20 + "," + 20 + ")");

    this.svg.append("g")
      .attr("transform", "translate(" + 20 + "," + 20 + ")");
      
    d3.select("#chart").style("width", (width + 20 + 20) + "px");

    // Circle for each node.
    const circle = this.svg.append("g")
      .selectAll("circle")
      .data(this.nodes)
      .join("circle")
      .attr("cx", function(d){ return d['x']})
      .attr("cy", d => d['y'])
      .attr("fill", d => d['color']);

    // Ease in the circles.
    circle.transition() 
            .delay((d, i) => i * 5)
            .duration(800)
            .attrTween("r", d => {
              const i = d3.interpolate(0, d['r']);
              return t => d['r'] = i(t);
            });
      
    // Group name labels
    this.svg.selectAll('.grp')
      .data(Object.keys(groups))
      .join("text")
      .attr("class", "grp")
      .attr("text-anchor", "middle")
      .attr("x", d => groups[d].x)
      .attr("y", d => groups[d].y - 70)
      .text(d => groups[d].fullname);  

    //male & female labels
    this.svg.selectAll(".yAxis")
      .data(["Male","Female"])
      .join("text")
      .attr("class",".yAxis")
      .attr("text-anchor", "middle")
      .attr("x", d => 20)
      .attr("y", d => d=="Male"?(height+30)/3:(height+130)/3*2)
      .text(d => d);  

            

    // Group counts
    this.svg.selectAll('.grpcnt')
      .data(Object.keys(groups))
      .join("text")
      .attr("class", "grpcnt")
      .attr("text-anchor", "middle")
      .attr("x", d => groups[d].x)
      .attr("y", d => groups[d].y - 40)
      .text(d => groups[d].cnt);

      // Forces
    let simulation = d3.forceSimulation(this.nodes)
      .force("x", (d:any) => d3.forceX(d.x))
      .force("y", (d:any) => d3.forceY(d.y))
      .force("cluster", this.forceCluster())
      .force("collide", this.forceCollide())
      .alpha(.09)
      .alphaDecay(0)
      .on('tick', this.ticked);  
  }

 forceCluster = () => {
    const strength = .15;
    let nodes;
  
    function force(alpha) {
      const l = alpha * strength;
      for (const d of nodes) {
        d.vx -= (d.x - groups[d.group].x) * l;
        d.vy -= (d.y - groups[d.group].y-20) * l;
      }
    }
    force.initialize = _ => nodes = _;
  
    return force;
  }

  forceCollide() {
    const alpha = 0.4; // fixed for greater rigidity!
    const padding1 = this.padding; // separation between same-color nodes
    const padding2 = this.cluster_padding; // separation between different-color nodes
    let nodes;
    let maxRadius;
  
    function force() {
      const quadtree = d3.quadtree(nodes, (d:any) => d.x, d => d.y);
      for (const d of nodes) {
        const r = d.r + maxRadius;
        const nx1 = d.x - r, ny1 = d.y - r;
        const nx2 = d.x + r, ny2 = d.y + r;
        
        quadtree.visit((q:any, x1, y1, x2, y2) => {
          if (!q.length) do {
            if (q.data !== d) {
              const r = d.r + q.data.r + (d.group === q.data.group ? padding1 : padding2);
              let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
              if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l, d.y -= y *= l;
                q.data.x += x, q.data.y += y;
              }
            }
          } while (q = q.next);
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      }
    }
  
    force.initialize = _ => maxRadius = d3.max(nodes = _, (d:any) => d.r) + Math.max(padding1, padding2);
  
    return force;
  }

  ticked = () => {
    var u = this.svg
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
      .attr('r', function(d:any) { 
        return d.r
      }) 
      .attr('cx', function(d:any) {
        return d.x
      })
      .attr('cy', function(d:any) {
        return d.y
      })
  }

  parseGroup(sex: any, levels: any) {
    if(levels == "BAD")
      return `bad_${sex}`
    if(levels == "FAIR")
      return `fair_${sex}`
    if(levels == "GOOD")
      return `good_${sex}`
    if(levels == "VBAD")
      return `very_bad_${sex}`
    if(levels == "VGOOD")
      return `very_good_${sex}`
    throw new Error(`Not a valid className: ${levels}`); 
  }

  generate_people = (data:any) => {
    this.nodes = [];
    let filtered = data.filter( x => x.age == this.ageFilter)
    for(let i=0; i<filtered.length; i++){
      let obj = {"nmr":filtered[i]};
      let nmbr_of_people = Math.round(parseFloat(filtered[i].OBS_VALUE));
      let groupName = this.parseGroup(filtered[i].sex, filtered[i].levels);
      groups[groupName].cnt = nmbr_of_people;
      console.log(groupName+":"+nmbr_of_people)
      for(let y=0; y<nmbr_of_people;y++){
        let n = {
          index:i,
          x: width/2+Math.random()*100,
          y: height/2+Math.random()*100,
          r: this.radius,
          group: groupName,
          vx:0,
          vy:0,
          color: filtered[i].sex == "M"?"#96D6F7":"#F7D4E0",
          sex: filtered[i].sex
        }
        this.nodes = this.nodes.concat(n);
      }
    }
    console.log(this.nodes);

  }

  btnClick = () => {
    for(let i=0; i<10; i++){
      this.nodes[i].group = "good_M";
    }


  }

}

let width = 1000;
let height = 400;
let pad_left = 200;
let y_offset = 100;

let groups = {
  "very_good_M": { x: width/6*0+pad_left, y:y_offset, cnt: 0, fullname: "very good" },
  "good_M": { x: width/6*1+pad_left, y:y_offset, cnt: 0, fullname: "good" },
  "fair_M": { x: width/6*2+pad_left, y:y_offset, cnt: 0, fullname: "fair" },
  "bad_M": { x: width/6*3+pad_left, y:y_offset, cnt: 0, fullname: "bad" },
  "very_bad_M": { x: width/6*4+pad_left, y:y_offset, cnt: 0, fullname: "very bad" },
  "very_good_F": { x: width/6*0+pad_left, y:y_offset+height/2, cnt: 0, fullname: "" },
  "good_F": { x: width/6*1+pad_left, y:y_offset+height/2, cnt: 0, fullname: "" },
  "fair_F": { x: width/6*2+pad_left, y:y_offset+height/2, cnt: 0, fullname: "" },
  "bad_F": { x: width/6*3+pad_left, y:y_offset+height/2, cnt: 0, fullname: "" },
  "very_bad_F": { x: width/6*4+pad_left, y:y_offset+height/2, cnt: 0, fullname: "" },
};



