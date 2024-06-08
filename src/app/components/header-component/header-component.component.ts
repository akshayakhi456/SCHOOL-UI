import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../shared/signal-service/global.service';
import { ACADEMIC_YEAR } from '../../shared/models/payment.model';
import { FormControl } from '@angular/forms';

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

  constructor(private globalService: GlobalService) {
    this.academicYearId.valueChanges.subscribe((res: any) => {
      this.globalService.setAcademicYear(res);
    })
  }

  opencloseSideNav() {
    this.globalservice.headerMenuClick.set(this.menuStatus = !this.menuStatus);
  }
}
