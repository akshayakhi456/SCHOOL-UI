import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
// import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-todays-collection-report',
  standalone: true,
  imports: [CommonModule, SharedModule],
  // providers: [provideNativeDateAdapter()],
  templateUrl: './todays-collection-report.component.html',
  styleUrl: './todays-collection-report.component.scss'
})
export class TodaysCollectionReportComponent {
  academicSession = [
    {
      value: 1,
      viewValue: 'I'
    },
    {
      value: 2,
      viewValue: 'II'
    },
    {
      value: 3,
      viewValue: 'III'
    },
    {
      value: 4,
      viewValue: 'IV'
    }
  ];
  paymentDateList = [
    {
      value: 'today',
      viewValue: 'Today'
    },
    {
      value: 'yesterday',
      viewValue: 'Yesterday'
    },
    {
      value: '7days',
      viewValue: 'Last 7 days'
    },
    {
      value: 'custom',
      viewValue: 'Custom date Range'
    }
  ]
}
