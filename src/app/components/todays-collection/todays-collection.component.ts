import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto'
import { PaymentsService } from '../../shared/services/payments/payments.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';

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
    {value: 'Today', viewValue: 'Today'},
    {value: 'Yesterday', viewValue: 'Yesterday'},
  ];

  constructor(private paymentService: PaymentsService,
    private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.getReceiptList();
  }

  getReceiptList(): void{
    this.spinnerService.show();
    this.paymentService.getclassWiseReport().subscribe({next: res => {
      this.spinnerService.dispose();
      this.data = res.result ?? res;
      this.initialize();
    },
    error: () =>{
      this.spinnerService.dispose();
    }
  })
}

  initialize(): void {
    this.chart = new Chart('canvas',
    {
      type: 'bar',
      data: {
        labels:  this.data.map((row: any) => 'Class ' + row.className),
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
