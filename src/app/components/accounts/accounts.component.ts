import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StudentwiseAccountsComponent } from './studentwise-accounts/studentwise-accounts.component';
import { ClasswiseAccountsComponent } from './classwise-accounts/classwise-accounts.component';
import { OverallAccountsComponent } from './overall-accounts/overall-accounts.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [SharedModule, StudentwiseAccountsComponent, ClasswiseAccountsComponent, OverallAccountsComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {

}
