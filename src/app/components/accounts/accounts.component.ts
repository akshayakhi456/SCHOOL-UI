import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StudentwiseAccountsComponent } from './studentwise-accounts/studentwise-accounts.component';
import { ClasswiseAccountsComponent } from './classwise-accounts/classwise-accounts.component';
import { OverallAccountsComponent } from './overall-accounts/overall-accounts.component';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { InvoiceReceiptComponent } from '../../shared/components/invoice-receipt/invoice-receipt.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [SharedModule, CommonModule, InvoiceReceiptComponent, StudentwiseAccountsComponent, ClasswiseAccountsComponent, OverallAccountsComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  selectedIndex = 0;
  breadcrumbData: IBreadcrumb = {
    title: 'Accounts',
    list: [{
      routerLink: '/accounts',
      subTitle: 'Accounts',
      isRoute: true
  }]
}
constructor(private breadcrumbService: BreadCrumbService) {
  this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
}

changeTab(tabIndex: number): void {
  this.selectedIndex = tabIndex;
}

}
