import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-expenses-graph',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './expenses-graph.component.html',
  styleUrl: './expenses-graph.component.scss'
})
export class ExpensesGraphComponent {
  chart: any;
  data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];
  timeList = [
    {value: 'Today', viewValue: 'Today'},
    {value: 'Yesterday', viewValue: 'Yesterday'},
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {this.intialize();})
  }
  
  intialize() {
  this.chart = new Chart('expenses-graph-canvas',
  {
    type: 'line',
    data: {
      labels: this.data.map(row => row.year),
      datasets: [
        {
          label: 'Rupees',
          data: this.data.map(row => row.count)
        }
      ]
    }
  }
);
}

redirectToReport(): void {
this.router.navigate(['/school-expenses']);
}
}
