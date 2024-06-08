import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SharedModule } from '../../../shared/shared.module';
import { GlobalService } from '../../../shared/signal-service/global.service';

@Component({
  selector: 'app-overall-accounts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './overall-accounts.component.html',
  styleUrl: './overall-accounts.component.scss'
})
export class OverallAccountsComponent {
  displayedColumns: Array<string> = [ 'actualAmount', 'receivedAmount', 'pendingAmount'];
  dataSource = new MatTableDataSource();

  constructor(private paymentService: PaymentsService,
    private globalService: GlobalService,
    private spinnerService: SpinnerService
  ) {
    this.globalService.academicYearData.subscribe((res) =>{ 
      this.getReceiptList(res);
    })
  }

  getReceiptList(yearId: number): void{
    this.spinnerService.show();
    this.paymentService.getyearWiseReport(yearId).subscribe({next: res => {
      this.spinnerService.dispose();
      let result = res.result ?? res;
      this.dataSource.data = result;
    },
    error: () =>{
      this.spinnerService.dispose();
    }
  })
  }
}
