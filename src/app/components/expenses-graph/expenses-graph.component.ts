import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto'
import { ExpensesService } from '../../shared/services/expenses/expenses.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { app } from '../../shared/global-constant.constants';

@Component({
  selector: 'app-expenses-graph',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './expenses-graph.component.html',
  styleUrl: './expenses-graph.component.scss'
})
export class ExpensesGraphComponent {
  chart: any;
  monthList = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }
  data = [
    // { month: 2010, count: 10 },
    // { month: 2011, count: 20 },
    // { month: 2012, count: 15 },
    // { month: 2013, count: 25 },
    // { month: 2014, count: 22 },
    // { month: 2015, count: 30 },
    // { month: 2016, count: 28 },
  ];
  timeList = [
    {value: 'Today', viewValue: 'Today'},
    {value: 'Yesterday', viewValue: 'Yesterday'},
  ];

  constructor(private expensesService: ExpensesService,
    private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.getExpensesList();
  }

  getExpensesList(): void{
    this.spinnerService.show();
    this.expensesService.getExpensesGraph().subscribe({next: res => {
      this.spinnerService.dispose();
      this.data = res.result ?? res;
      this.expensesGraph();
    },
    error: () =>{
      this.spinnerService.dispose();
    }
  })
}

  expensesGraph() {
    var ctx2 = document.getElementById('lineChart') as | string
    | CanvasRenderingContext2D
    | HTMLCanvasElement
    | { canvas: HTMLCanvasElement }
    | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;
    var lineChart = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: this.data.map((row:any) => (this.monthList as any)[row.month]),
        datasets: [{
         label: 'Rupees',
         data: this.data.map((row: any) => row.count),
         borderColor: app.color.theme,
         borderWidth: 1.5,
         pointBackgroundColor: app.color.theme,
         pointBorderWidth: 1.5,
         pointRadius: 4,
         pointHoverBackgroundColor:app.color.theme,
         pointHoverBorderColor: app.color.theme, 
      }]
    }
    });
  }
  
  initialize() {
  this.chart = new Chart('expenses-graph-canvas',
  {
    type: 'line',
    data: {
      labels: this.data.map((row:any) => (this.monthList as any)[row.month]),
      datasets: [
        {
          label: 'Rupees',
          data: this.data.map((row: any) => row.count)
        }
      ]
    }
  }
);
}

}
