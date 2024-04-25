import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { TodaysCollectionComponent } from '../todays-collection/todays-collection.component';
import { FeeSummaryComponent } from '../fee-summary/fee-summary.component';
import {  } from '../receipts/receipts.component';
import { ExpensesGraphComponent } from '../expenses-graph/expenses-graph.component';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { DashboardService } from '../../shared/services/dashboard/dashboard.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';

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
  dashboardInfo = {
    feeCollection: 0,
    feePending: 0,
    totalStudent: 0,
    newAdmissionThisMonth: 0,
    newAdmissionThisWeek: 0,
    newAdmissionToday: 0,
    newStudents: 0
  }
  constructor(private dashboardService: DashboardService,
    private spinnerService: SpinnerService
  ) {
    this.breadcrumbService.setBreadcrumb(false, null);
  }

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData(): void {
    this.spinnerService.show();
    this.dashboardService.getDashboardData().subscribe({
      next: (res: any) => {
        this.spinnerService.dispose();
        if (res.statusCode === 200) {
          this.dashboardInfo = res.result.result;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
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
