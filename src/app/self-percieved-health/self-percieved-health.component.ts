import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

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

  

  nodes;

  ngOnInit(): void {
    d3.csv("/assets/data/self_p_health.csv").then( (data) => {

    })

    this.generate_people();

    const svg = d3.select("#chart").append("svg")
                  .attr("width", width + 20 + 20)
                  .attr("height", height + 20 + 20)
                  .append("g")
                  .attr("transform", "translate(" + 20 + "," + 20 + ")");

    svg.append("g")
      .attr("transform", "translate(" + 20 + "," + 20 + ")");
      
    d3.select("#chart").style("width", (width + 20 + 20) + "px");

    // Circle for each node.
    const circle = svg.append("g")
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
    svg.selectAll('.grp')
      .data(Object.keys(groups))
      .join("text")
      .attr("class", "grp")
      .attr("text-anchor", "middle")
      .attr("x", d => groups[d].x)
      .attr("y", d => groups[d].y - 70)
      .text(d => groups[d].fullname);  

    //male & female labels
    svg.selectAll(".yAxis")
      .data(["Male","Female"])
      .join("text")
      .attr("class",".yAxis")
      .attr("text-anchor", "middle")
      .attr("x", d => 20)
      .attr("y", d => d=="Male"?(height+30)/3:(height+130)/3*2)
      .text(d => d);  

            

    // Group counts
    svg.selectAll('.grpcnt')
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
    var u = d3.select('svg')
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

  

  generate_people = () => {
    let woman = [...Array(100).keys()].map(x => {
      return {
        index:x,
        x: width/2+Math.random()*100,
        y: height/2+Math.random()*100,
        r: this.radius,
        group: "very_good_F",
        vx:0,
        vy:0,
        color: "#F7D4E0",
        sex:"w"
      }
    });

    let men = [...Array(100).keys()].map(x => {
      return {
        index:x,
        x: width/2+Math.random()*100,
        y: height/2+Math.random()*100,
        r: this.radius,
        group: "very_good_M",
        vx:0,
        vy:0,
        color: "#96D6F7",
        sex:"m"
      }
    });

    this.nodes = men.concat(woman);

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