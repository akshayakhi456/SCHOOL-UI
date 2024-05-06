import { Component } from '@angular/core';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [],
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

  constructor( private breadcrumbService: BreadCrumbService) {}

  ngAfterViewInit() {
    this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
  }
}
