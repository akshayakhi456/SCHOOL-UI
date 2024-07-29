import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../shared/signal-service/global.service';
import { ACADEMIC_YEAR } from '../../shared/models/payment.model';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { ROLES } from '../../shared/models/common.models';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.scss'
})
export class HeaderComponentComponent {
  academicYearId = new FormControl(1);
  menuStatus = true;
  academicList = ACADEMIC_YEAR;
  globalservice = inject(GlobalService);
  isAdminOwner = false;
  constructor(private globalService: GlobalService,
    public authentication: AuthenticationService,) {
    this.academicYearId.valueChanges.subscribe((res: any) => {
      this.globalService.setAcademicYear(res);
    })
  }

  async ngAfterViewInit(): Promise<void> {
    const role = await this.authentication.role();
    this.isAdminOwner = role === ROLES.OWNER || role === ROLES.ADMIN;
  }

  opencloseSideNav() {
    this.globalservice.headerMenuClick.set(this.menuStatus = !this.menuStatus);
  }
}
