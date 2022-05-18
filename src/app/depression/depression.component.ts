import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

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

  nodes;
  ngOnInit(): void {

    d3.csv("/assets/depression/depression_be.csv").then( (data) => {
      let ages = d3.map(data, function(d) {return(d['age'])}).keys()
      console.log(ages)

    })
  }


}
