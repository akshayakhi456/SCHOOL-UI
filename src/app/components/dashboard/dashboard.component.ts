import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { TodaysCollectionComponent } from '../todays-collection/todays-collection.component';
import { FeeSummaryComponent } from '../fee-summary/fee-summary.component';
import {  } from '../receipts/receipts.component';
import { ExpensesGraphComponent } from '../expenses-graph/expenses-graph.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    SideMenuComponent,
    SharedModule,
    TodaysCollectionComponent,
    ExpensesGraphComponent,
    FeeSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
