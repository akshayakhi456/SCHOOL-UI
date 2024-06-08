import { Component } from '@angular/core';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { AddTeacherComponent } from '../add-teacher/add-teacher.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { TeacherService } from '../../../shared/services/teacher/teacher.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { ITeacherDetails } from '../../../shared/models/teacher.models';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [AddTeacherComponent, 
    SharedModule,
    CommonModule
  ],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
  teacherList: Array<ITeacherDetails> = [];
  breadcrumbData: IBreadcrumb = {
    title: 'Teachers',
    list: [{
      routerLink: '/teacher-list',
      subTitle: 'Teacher-List',
      isRoute: true
  }]
  }

  constructor( private breadcrumbService: BreadCrumbService,
    private spinnerService: SpinnerService,
    private teacherService: TeacherService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
    this.getTeacherList();
  }

  openAddTeacher() {
    this.dialog.open(AddTeacherComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '100vh',
      maxWidth:'80vw'
    })
  }

  getTeacherList(): void {
    this.spinnerService.show();
    this.teacherService.getTeachers().subscribe((res) => {
      this.spinnerService.dispose();
      if(res.statusCode == HTTP_CODES.SUCCESS) {
        this.teacherList = res.result!;
      }
    },() =>{
      this.spinnerService.dispose();
    });
  }

  viewTeacherDetails(id: number): void {
    this.dialog.open(AddTeacherComponent, {
      data: {
        id
      },
      width: 'auto',
      height: 'auto',
      maxHeight: '100vh',
      maxWidth:'80vw'
    })
  }
}
