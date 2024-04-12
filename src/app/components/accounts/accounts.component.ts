import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StudentwiseAccountsComponent } from './studentwise-accounts/studentwise-accounts.component';
import { ClasswiseAccountsComponent } from './classwise-accounts/classwise-accounts.component';
import { OverallAccountsComponent } from './overall-accounts/overall-accounts.component';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [SharedModule, StudentwiseAccountsComponent, ClasswiseAccountsComponent, OverallAccountsComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
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

}
