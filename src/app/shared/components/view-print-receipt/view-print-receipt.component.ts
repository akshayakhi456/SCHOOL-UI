import { Component, Input } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-print-receipt',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './view-print-receipt.component.html',
  styleUrl: './view-print-receipt.component.scss'
})
export class ViewPrintReceiptComponent {
  @Input() stdInfo: any;
  @Input() isSingleReceipt = false;
  @Input() originalReceipt: any;
  @Input() selectedReceipt: any;
  todayDate = new Date();
  constructor() {}

  ngOnInit() {
  }
}
