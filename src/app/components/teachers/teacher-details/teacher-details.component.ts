import { Component } from '@angular/core';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';

@Component({
  selector: 'app-teacher-details',
  standalone: true,
  imports: [],
  templateUrl: './teacher-details.component.html',
  styleUrl: './teacher-details.component.scss'
})
export class TeacherDetailsComponent {
  breadcrumbData: IBreadcrumb = {
    title: 'Teachers',
    list: [{
      routerLink: '/teacher-detail',
      subTitle: 'Teacher-Detail',
      isRoute: true
  }]
  }

  constructor( private breadcrumbService: BreadCrumbService) {}

  ngAfterViewInit() {
    this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
  }
}
