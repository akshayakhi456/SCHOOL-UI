import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TodaysCollectionReportComponent } from './components/todays-collection-report/todays-collection-report.component';
import { AuthGuard } from './shared/auth.guard';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { CreateEnquiryComponent } from './components/create-enquiry/create-enquiry.component';
import { SchoolExpensesComponent } from './components/school-expenses/school-expenses.component';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';
import { EnquiryListComponent } from './components/enquiry-list/enquiry-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { ProgressCardComponent } from './components/progress-card/progress-card.component';
import { AccountsComponent } from './components/accounts/accounts.component';

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'login', component: LoginFormComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'collection-report', component: TodaysCollectionReportComponent, canActivate: [AuthGuard]},
    {path: 'admission', component: AdmissionFormComponent, canActivate: [AuthGuard]},
    {path: 'student/:id', component: AdmissionFormComponent, canActivate: [AuthGuard]},
    {path: 'student-list', component: StudentsListComponent, canActivate: [AuthGuard]},
    {path: 'create-enquiry', component: CreateEnquiryComponent, canActivate: [AuthGuard]},
    {path: 'enquiry/:id', component: CreateEnquiryComponent, canActivate: [AuthGuard]},
    {path: 'enquiry-list', component: EnquiryListComponent, canActivate: [AuthGuard]},
    {path: 'school-expenses', component: SchoolExpensesComponent, canActivate: [AuthGuard]},
    {path: 'certificates', component: CertificatesComponent, canActivate: [AuthGuard]},
    {path: 'progressCard', component: ProgressCardComponent, canActivate: [AuthGuard]},
    {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
    {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard]},
];
