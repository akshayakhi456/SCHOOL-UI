import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { CreateEnquiryComponent } from './components/create-enquiry/create-enquiry.component';
import { SchoolExpensesComponent } from './components/school-expenses/school-expenses.component';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';
import { EnquiryListComponent } from './components/enquiry-list/enquiry-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { authGuard } from './shared/guards/auth.guard';
import { unauthGuard } from './shared/guards/unauth.guard';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { TeacherListComponent } from './components/teachers/teacher-list/teacher-list.component';
import { TeacherDetailsComponent } from './components/teachers/teacher-details/teacher-details.component';
import { AttendanceComponent } from './components/certificates/attendance/attendance.component';
import { StudentAttendanceComponent } from './components/academics/student-attendance/student-attendance.component';
import { ApplyLeaveComponent } from './components/academics/apply-leave/apply-leave.component';
import { MarkAttendanceComponent } from './components/class/mark-attendance/mark-attendance.component';
import { StudentSectionAssignmentComponent } from './components/class/student-section-assignment/student-section-assignment.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { ROLES } from './shared/models/common.models';
import { AddMarksComponent } from './components/class/add-marks/add-marks.component';

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'login', component: LoginFormComponent, canActivate: [unauthGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: {Roles: [ROLES.ADMIN, ROLES.OWNER]}},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'admission', component: AdmissionFormComponent, canActivate: [authGuard], data: {Roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.TEACHER]}},
    {path: 'student/:id', component: AdmissionFormComponent, canActivate: [authGuard], data: {Roles: [ROLES.ADMIN, ROLES.OWNER]}},
    {path: 'student-list', component: StudentsListComponent, canActivate: [authGuard]},
    {path: 'create-enquiry', component: CreateEnquiryComponent, canActivate: [authGuard]},
    {path: 'enquiry/:id', component: CreateEnquiryComponent, canActivate: [authGuard]},
    {path: 'enquiry-list', component: EnquiryListComponent, canActivate: [authGuard]},
    {path: 'school-expenses', component: SchoolExpensesComponent, canActivate: [authGuard]},
    {path: 'attendance', component: AttendanceComponent, canActivate: [authGuard]},
    {path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
    {path: 'accounts', component: AccountsComponent, canActivate: [authGuard]},
    {path: 'student-details/:id', component: StudentDetailComponent, canActivate: [authGuard]},
    {path: 'payment/:id', component: PaymentsComponent, canActivate: [authGuard]},
    {path: 'userAccounts', component: UserAccountsComponent, canActivate: [authGuard]},
    {path: 'changePassword', component: ChangePasswordComponent, canActivate: [authGuard]},
    {path: 'teacher-list', component: TeacherListComponent, canActivate: [authGuard]},
    {path: 'teacher-detail', component: TeacherDetailsComponent, canActivate: [authGuard]},
    {path: 'student-profile', component: StudentProfileComponent, canActivate: [authGuard]},
    {path: 'viewAttendance', component: StudentAttendanceComponent, canActivate: [authGuard]},
    {path: 'applyLeave', component: ApplyLeaveComponent, canActivate: [authGuard]},
    {path: 'mark-attendance', component: MarkAttendanceComponent, canActivate: [authGuard]},
    {path: 'section-assignment', component: StudentSectionAssignmentComponent, canActivate: [authGuard]},
    {path: 'add-marks', component: AddMarksComponent, canActivate: [authGuard]},
    {path: 'newPassword', component: NewPasswordComponent},
];
