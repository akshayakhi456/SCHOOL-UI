import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-todays-collection',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './todays-collection.component.html',
  styleUrl: './todays-collection.component.scss'
})
export class TodaysCollectionComponent {
  chart: any;
  data = [
    { class: 'Class I', count: 10000 },
    { class: 'Class II', count: 12000 },
    { class: 'Class III', count: 15000 },
    { class: 'Class IV', count: 25000 },
    { class: 'Class V', count: 22000 },
    { class: 'Class VI', count: 30000 },
    { class: 'Class VII', count: 28000 },
  ];
  timeList = [
    {value: 'Today', viewValue: 'Today'},
    {value: 'Yesterday', viewValue: 'Yesterday'},
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {this.initialize()});
  }

  initialize(): void {
    this.chart = new Chart('canvas',
    {
      type: 'bar',
      data: {
        labels: this.data.map(row => row.class),
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
    this.router.navigate(['/collection-report']);
  }
}
