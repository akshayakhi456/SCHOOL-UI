import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import Chart from 'chart.js/auto'
import { PaymentsService } from '../../shared/services/payments/payments.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { app } from '../../shared/global-constant.constants';
import { GlobalService } from '../../shared/signal-service/global.service';

@Component({
  selector: 'app-todays-collection',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './todays-collection.component.html',
  styleUrl: './todays-collection.component.scss'
})
export class TodaysCollectionComponent {
  chart: any;
  data = [];
  timeList = [
    { value: 'Today', viewValue: 'Today' },
    { value: 'Yesterday', viewValue: 'Yesterday' },
  ];

  constructor(private paymentService: PaymentsService,
    private globalService: GlobalService,
    private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.globalService.academicYearData.subscribe((res) =>{
      this.getReceiptList(res);
    })
  }

  getReceiptList(yearId: number): void {
    this.spinnerService.show();
    this.paymentService.getclassWiseReport(yearId).subscribe({
      next: res => {
        this.spinnerService.dispose();
        this.data = res.result ?? res;
        this.barChart();
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  barChart(): void {
    var ctx2 = document.getElementById('barChart') as | string
      | CanvasRenderingContext2D
      | HTMLCanvasElement
      | { canvas: HTMLCanvasElement }
      | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;
    var barChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: this.data.map((row: any) => 'Class ' + row.className),
        datasets: [{
          label: 'Received Amount',
          data: this.data.map((row: any) => row.receivedAmount),
          backgroundColor: 'rgba(' + app.color.themeRgb + ', .25)',
          borderColor: app.color.theme,
          borderWidth: 1.5
        }, {
          label: 'Pending Amount',
          data: this.data.map((row: any) => row.pendingAmount),
          backgroundColor: 'rgba(' + app.color.secondaryRgb + ', .25)',
          borderColor: app.color.secondary,
          borderWidth: 1.5
        }]
      }
    });
  }

  initialize(): void {
    this.chart = new Chart('canvas',
      {
        type: 'bar',
        data: {
          labels: this.data.map((row: any) => 'Class ' + row.className),
          datasets: [
            {
              label: 'Total Amount',
              data: this.data.map((row: any) => row.actualAmount)
            },
            {
              label: 'Received Amount',
              data: this.data.map((row: any) => row.receivedAmount)
            },
            {
              label: 'Pending Amount',
              data: this.data.map((row: any) => row.pendingAmount)
            }
          ]
        }
      }
    );
  }

}
