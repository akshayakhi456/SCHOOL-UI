import { Component } from '@angular/core';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { AddTeacherComponent } from '../add-teacher/add-teacher.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [AddTeacherComponent, SharedModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
  breadcrumbData: IBreadcrumb = {
    title: 'Teachers',
    list: [{
      routerLink: '/teacher-list',
      subTitle: 'Teacher-List',
      isRoute: true
  }]
  }

  constructor( private breadcrumbService: BreadCrumbService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
  }

  openAddTeacher() {
    this.dialog.open(AddTeacherComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '100vh',
      maxWidth:'80vw'
    })
  }
}
