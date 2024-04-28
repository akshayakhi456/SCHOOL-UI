import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-side-nav',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './right-side-nav.component.html',
  styleUrl: './right-side-nav.component.scss'
})
export class RightSideNavComponent {

  menuList = [
    {
      routerLink: 'accounts',
      iconClass: 'bi bi-currency-rupee fs-36',
      title: 'Accounting'
    },
    {
      routerLink: 'settings',
      iconClass: 'bi bi-gear fs-36',
      title: 'Settings'
    },
    {
      routerLink: 'school-expenses',
      iconClass: 'bi bi-cash-coin fs-36',
      title: 'Expenses'
    },
    {
      routerLink: 'userAccounts',
      iconClass: 'bi bi-people fs-36',
      title: 'User Account'
    }
  ]

}
