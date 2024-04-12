import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClassSettingsComponent } from './class-settings/class-settings.component';
import { EnquiryFormQuestionsComponent } from './enquiry-form-questions/enquiry-form-questions.component';
import { PaymentSettingsComponent } from './payment-settings/payment-settings.component';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';


export interface ClassInfo {
  className: string;
  sections: Array<string>;
  feeStructure: Array<string>;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule, CommonModule, MatFormFieldModule, PaymentSettingsComponent, ClassSettingsComponent, EnquiryFormQuestionsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  breadcrumbData: IBreadcrumb = {
    title: 'Settings',
    list: [{
      routerLink: '/settings',
      subTitle: 'Settings',
      isRoute: true
  }]
}
constructor(private breadcrumbService: BreadCrumbService) {
  this.breadcrumbService.setBreadcrumb(true, this.breadcrumbData);
}
}
