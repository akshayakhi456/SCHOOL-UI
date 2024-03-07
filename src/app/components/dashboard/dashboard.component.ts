import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { TodaysCollectionComponent } from '../todays-collection/todays-collection.component';
import { FeeSummaryComponent } from '../fee-summary/fee-summary.component';
import { VehicleVacancyComponent } from '../vehicle-vacancy/vehicle-vacancy.component';
import { AttendanceComponent } from '../attendance/attendance.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    SideMenuComponent,
    SharedModule,
    TodaysCollectionComponent,
    FeeSummaryComponent,
    VehicleVacancyComponent,
    AttendanceComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
