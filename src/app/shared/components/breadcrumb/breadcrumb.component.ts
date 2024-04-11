import { Component, effect, inject } from '@angular/core';
import { BreadCrumbService } from '../../signal-service/breadcrumb.service';
import { IBreadcrumb } from '../../interfaces/global.model';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})

export class BreadcrumbComponent {
  isShowBreadcrumb = false;
  breadcrumbData: IBreadcrumb | null = null;
  breadcrumbService = inject(BreadCrumbService);
  constructor() {
    effect(() => {
      this.isShowBreadcrumb = this.breadcrumbService.isShowBreadcrumb();
      this.breadcrumbData = this.breadcrumbService.breadcrumbData();
    })
  }
}
