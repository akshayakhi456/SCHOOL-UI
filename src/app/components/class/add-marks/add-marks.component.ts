import { Component } from '@angular/core';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { BreadCrumbService } from '../../../shared/signal-service/breadcrumb.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { IBreadcrumb } from '../../../shared/interfaces/global.model';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-marks',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-marks.component.html',
  styleUrl: './add-marks.component.scss'
})
export class AddMarksComponent {
  className = new FormControl('', Validators.required);
  section = new FormControl('', Validators.required);
  classList: Array<{label: string; value: string}> = [];
  orgSectionList: Array<{label: string; value: string}> = [];
  sectionList: Array<{label: string; value: string}> = [];
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  breadcrumbData: IBreadcrumb = {
    title: 'Student Subject Mark',
    list: [{
      routerLink: '/subject-marks',
      subTitle: 'subject-marks',
      isRoute: true
  }]
  }
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService,
    private breadcrumb: BreadCrumbService,
    private snackbar: SnackbarService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
  }

  ngOnInit(): void {
    this.getClassList();
    this.getSectionList();
   
    this.columnsToDisplay = this.displayedColumns.slice();

    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['className'] == res)
    })
  }

  getClassList() {
    this.spinnerService.show();
    this.settingService.getClasses().subscribe(res => {
      this.spinnerService.dispose();
      this.classList = res.map((r: any) => {
        return {
          label: r.className,
          value: r.className
        }
      })
    },()=>{
      this.spinnerService.dispose();
    })
  }

  getSectionList() {
    this.spinnerService.show();
    this.settingService.getSections().subscribe({next: res => {
      this.spinnerService.dispose();
      this.orgSectionList = res.res.map((x: any) => {
        return {
          ...x,
          label: x.section,
          value: x.section
        }
      })
    },error:() =>{
      this.spinnerService.dispose();
    }})
  }
}
