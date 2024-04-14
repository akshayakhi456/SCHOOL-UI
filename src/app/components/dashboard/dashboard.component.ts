import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { TodaysCollectionComponent } from '../todays-collection/todays-collection.component';
import { FeeSummaryComponent } from '../fee-summary/fee-summary.component';
import {  } from '../receipts/receipts.component';
import { ExpensesGraphComponent } from '../expenses-graph/expenses-graph.component';
import { Chart } from 'chart.js';
import { app } from '../../shared/global-constant.constants';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    SideMenuComponent,
    SharedModule,
    TodaysCollectionComponent,
    ExpensesGraphComponent,
    FeeSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  breadcrumbService = inject(BreadCrumbService);
  constructor() {
    this.breadcrumbService.setBreadcrumb(false, null);
  }

  // ngAfterViewInit() {
  //   var ctx2 = document.getElementById('barChart') as | string
  //   | CanvasRenderingContext2D
  //   | HTMLCanvasElement
  //   | { canvas: HTMLCanvasElement }
  //   | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;
  // var barChart = new Chart(ctx2, {
  //   type: 'bar',
  //   data: {
  //     labels: ['Jan','Feb','Mar','Apr','May','Jun'],
  //     datasets: [{
  //       label: 'Total Visitors',
  //       data: [37,31,36,34,43,31],
  //       backgroundColor: 'rgba('+ app.color.themeRgb +', .25)',
  //       borderColor: app.color.theme,
  //       borderWidth: 1.5
  //     },{
  //       label: 'New Visitors',
  //       data: [12,16,20,14,23,21],
  //       backgroundColor: 'rgba('+ app.color.secondaryRgb +', .25)',
  //       borderColor: app.color.secondary,
  //       borderWidth: 1.5
  //     }]
  //   }
  // });
  // }

}
