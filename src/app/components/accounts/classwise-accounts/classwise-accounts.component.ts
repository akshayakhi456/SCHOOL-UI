import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SharedModule } from '../../../shared/shared.module';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { ACADEMIC_YEAR } from '../../../shared/models/payment.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-classwise-accounts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './classwise-accounts.component.html',
  styleUrl: './classwise-accounts.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClasswiseAccountsComponent implements OnInit {
  displayedColumns: Array<string> = ['className', 'actualAmount', 'receivedAmount', 'pendingAmount'];
  dataSource = new MatTableDataSource();
  expandedElement: any | null;
  classList: any;
  sectionList: any;
  orgSectionList = [];
  orgPaymentsFeeList: Array<{id: string; paymentName: string; className: string}> = [];
  paymentsFeeList: Array<{id: string; paymentName: string; className: string}> = [];
  academicList = ACADEMIC_YEAR;
  classWiseFormGroup = new FormGroup({
    className: new FormControl<string>('', Validators.required),
    section: new FormControl<string>('', Validators.required),
    academicYear: new FormControl<number|null>(null, Validators.required),
    PaymentAllotmentId: new FormControl<Array<number>| null>(null, Validators.required)
  })

  constructor(private paymentService: PaymentsService,
    private settingService: SettingsService,
    private spinnerService: SpinnerService
  ) {
    this.getClassWiseList();
    // this.getClassList();
    this.getSectionList();
  }

  get classWiseForm(): {[key: string]: AbstractControl} {
    return this.classWiseFormGroup.controls;
  }

  ngOnInit(): void {
    this.classWiseFormGroup.controls.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter(x => x['className'] == res)
      this.paymentsFeeList = this.orgPaymentsFeeList.filter(x => x.className == res)
    })
  }

  getClassWiseList(): void{
    this.spinnerService.show();
    this.paymentService.getclassWiseReport().subscribe({next: res => {
      this.spinnerService.dispose();
      let result = res.result ?? res;
      this.dataSource.data = result;
    },
    error: () =>{
      this.spinnerService.dispose();
    }
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

  getPaymentAllotment(){
    this.spinnerService.show();
    this.settingService.getPaymentAllotment(this.classWiseForm['className'].value).subscribe({next: res => {
      this.spinnerService.dispose();
      this.paymentsFeeList = res.result ?? res
    }, error: ()=>{
      this.spinnerService.dispose();
    }})
  }

  classWiseStudentRecord(row: any): void {
    this.classWiseFormGroup.patchValue({className: row.className});
    this.sectionList = this.orgSectionList.filter(x => x['className'] == row.className);
    if (this.sectionList.length) {
      this.classWiseFormGroup.controls.section.setValidators(Validators.required);
      this.classWiseFormGroup.controls.section.updateValueAndValidity({onlySelf: true});
    }
    else {      
      this.classWiseFormGroup.controls.section.clearValidators();
      this.classWiseFormGroup.controls.section.updateValueAndValidity({onlySelf: true});
    }
    this.getPaymentAllotment();
  }
}
