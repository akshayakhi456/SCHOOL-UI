import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FeeSummaryDetailComponent } from './components/fee-summary-detail/fee-summary-detail.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TodaysCollectionReportComponent } from './components/todays-collection-report/todays-collection-report.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'login', component: LoginFormComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'collection-report', component: TodaysCollectionReportComponent, canActivate: [AuthGuard]},
    {path: 'fee-detail', component: FeeSummaryDetailComponent, canActivate: [AuthGuard]},
];
