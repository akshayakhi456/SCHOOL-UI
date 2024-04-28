import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TodaysCollectionReportComponent } from './components/todays-collection-report/todays-collection-report.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { CreateEnquiryComponent } from './components/create-enquiry/create-enquiry.component';
import { SchoolExpensesComponent } from './components/school-expenses/school-expenses.component';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';
import { EnquiryListComponent } from './components/enquiry-list/enquiry-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { ProgressCardComponent } from './components/progress-card/progress-card.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { authGuard } from './shared/guards/auth.guard';
import { unauthGuard } from './shared/guards/unauth.guard';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'login', component: LoginFormComponent, canActivate: [unauthGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: 'collection-report', component: TodaysCollectionReportComponent, canActivate: [authGuard]},
    {path: 'admission', component: AdmissionFormComponent, canActivate: [authGuard]},
    {path: 'student/:id', component: AdmissionFormComponent, canActivate: [authGuard]},
    {path: 'student-list', component: StudentsListComponent, canActivate: [authGuard]},
    {path: 'create-enquiry', component: CreateEnquiryComponent, canActivate: [authGuard]},
    {path: 'enquiry/:id', component: CreateEnquiryComponent, canActivate: [authGuard]},
    {path: 'enquiry-list', component: EnquiryListComponent, canActivate: [authGuard]},
    {path: 'school-expenses', component: SchoolExpensesComponent, canActivate: [authGuard]},
    {path: 'certificates', component: CertificatesComponent, canActivate: [authGuard]},
    {path: 'progressCard', component: ProgressCardComponent, canActivate: [authGuard]},
    {path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
    {path: 'accounts', component: AccountsComponent, canActivate: [authGuard]},
    {path: 'student-details/:id', component: StudentDetailComponent, canActivate: [authGuard]},
    {path: 'payment/:id', component: PaymentsComponent, canActivate: [authGuard]},
    {path: 'userAccounts', component: UserAccountsComponent, canActivate: [authGuard]},
    {path: 'changePassword', component: ChangePasswordComponent, canActivate: [authGuard]}
];
