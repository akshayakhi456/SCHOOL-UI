import { Component, inject } from '@angular/core';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../shared/services/settings/settings.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { StudentService } from '../../shared/services/student/student.service';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, MatChipsModule],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent {
  service = inject(StudentService);
  settingService = inject(SettingsService);
  spinnerService = inject(SpinnerService);
  snackbar = inject(MatSnackBar);
  activatedRoute = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);
  spinner = inject(SpinnerService);
  breadcrumbService = inject(BreadCrumbService);
  imgViewer = '';
  selectedStudents: any;
  certificateList: any;
  fatherInfo: any;
  motherInfo: any;
  studentForm: any;
  address: any;
  breadcrumbData: IBreadcrumb = {
    title: 'Student Detail',
    list: [{
      routerLink: '/student-list',
      subTitle: 'Student-List',
      isRoute: true
    },{
      routerLink: '/student-detail',
      subTitle: 'Student-Detail',
      isRoute: true
    }]
  }

  ngOnInit(): void{
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.getStudentById(Number(id));
    }
    const isShowBreadCrumb = !this.activatedRoute.snapshot.routeConfig?.path?.startsWith('studentProfile');
    this.breadcrumbService.setBreadcrumb(isShowBreadCrumb, this.breadcrumbData);
  }

  getStudentById(id: number) {
    this.spinner.show();
    this.service.getById(id).subscribe({next: res => {
      this.spinner.dispose();
      const result = res.result ?? res;
      const studentPhoto = result.students.photo;
      const studentBase64Photo = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(studentPhoto) as any).changingThisBreaksApplicationSecurity;
      this.studentForm = result.students;
      this.imgViewer = studentBase64Photo;
      if (result.students.sibilings) {
        this.selectedStudents = JSON.parse(result.students.sibilings)
      }
      if (result.students.certificateNames) {
        this.certificateList = JSON.parse(result.students.certificateNames);
      }
      this.fatherInfo = result.guardians.find((f: any) => f.relationship === 'Father');
      this.motherInfo = result.guardians.find((f: any) => f.relationship === 'Mother');
      this.address = result.address;
    },
    error: () => {
      this.spinner.dispose();
    }
  })
  }
}
