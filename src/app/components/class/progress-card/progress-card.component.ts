import { Component } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './progress-card.component.html',
  styleUrl: './progress-card.component.scss'
})
export class ProgressCardComponent {
  className = new FormControl('', Validators.required);
  section = new FormControl('', Validators.required);
  classList: Array<{label: string; value: number}> = [];
  orgSectionList: Array<{label: string; value: number}> = [];
  sectionList: Array<{label: string; value: number}> = [];
  constructor(private spinnerService: SpinnerService,
    private settingService: SettingsService
  ) {}

  ngOnInit(): void {
    this.getClassList();
    this.getSectionList();
    this.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter((x: any) => x['className'] == res);
    })
  }

  getClassList() {
    this.spinnerService.show();
    this.settingService.getClasses().subscribe(res => {
      this.spinnerService.dispose();
      this.classList = res.map((r: any) => {
        return {
          label: r.className,
          value: r.id
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
