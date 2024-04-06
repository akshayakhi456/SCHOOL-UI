import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SharedModule } from '../../../shared/shared.module';

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
    private spinnerService: SpinnerService
  ) {this.getReceiptList()}

  getReceiptList(): void{
    this.spinnerService.show();
    this.paymentService.getyearWiseReport().subscribe({next: res => {
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
