import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';

@Component({
  selector: 'app-enquiry-form-questions',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './enquiry-form-questions.component.html',
  styleUrl: './enquiry-form-questions.component.scss'
})
export class EnquiryFormQuestionsComponent {
  @ViewChild('callAPIDialog') callAPIDialog!: TemplateRef<any>;
  @ViewChild('paginator') paginator!: MatPaginator | null;
  dataTypeList = ['text', 'dropdown'];
  pageSizes = [10, 25, 50, 100];
  displayedColumns: string[] = ['formControlName', 'question', 'status', 'action'];
  dataSource = new MatTableDataSource();
  questionForm = new FormGroup({
    id: new FormControl<number | null>(0),
    question: new FormControl<string>('', Validators.required),
    formControlName: new FormControl<string>('', Validators.required),
    type: new FormControl<string>('', Validators.required),
    options: new FormArray([]),
    isRequired: new FormControl<boolean>(false),
    isMultiple: new FormControl<boolean>(false),
    status: new FormControl<boolean>(false),
  })
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: SettingsService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackbarService,
    public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  get f(): { [key: string]: AbstractControl } {
    return this.questionForm.controls;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.getEnquiryQuestionList();
  }

  getEnquiryQuestionList() {
    this.spinnerService.show();
    this.service.getEnquiryQuestionsSettings().subscribe((res) => {
      this.spinnerService.dispose();
      this.dataSource.data = res.result;
      this.dataSource.paginator = this.paginator;
    },()=>{
      this.spinnerService.dispose();
    })

  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addQuestion() {
    this.questionForm.reset();
    this.questionForm.patchValue({
      id: 0,
      isRequired: false,
      isMultiple: false,
      status: false
    });
    this.dialog.open(this.callAPIDialog);
  }

  get options(): FormArray {
    return this.questionForm.get("options") as FormArray
  }

  newOption(value: string): FormGroup {
    return new FormGroup({
      option: new FormControl(value, Validators.required),
    })
  }

  addOption(value = '') {
    this.options.push(this.newOption(value));
  }

  removeOption(i: number) {
    this.options.removeAt(i);
  }

  SaveQuestion() {
    const form = this.questionForm.getRawValue();
    if (this.questionForm.invalid) {
      return;
    }
    const payload = {
      ...form,
      options: JSON.stringify(form.options)
    }
    if (this.questionForm.value.id) {
      this.spinnerService.show();
      this.service.updateQuestion(payload).subscribe({next:res => {
      this.spinnerService.dispose();
        const result = res.message;
        this.snackbar.openSuccessSnackbar(result);
        this.getEnquiryQuestionList();
      },error:()=>{
      this.spinnerService.dispose();
      }})
    }
    else {
      this.spinnerService.show();
      this.service.createQuestion(payload).subscribe(res => {
        this.spinnerService.dispose();
        const result = res.message;
        this.snackbar.openSuccessSnackbar(result);
        this.getEnquiryQuestionList();
      },() =>{
        this.spinnerService.dispose();
      })
    }
  }

  editQuestion(element: any) {
    const filterResult: any = this.dataSource.data.find(e => e == element);
    const result = filterResult;
    result.options = typeof (filterResult as any).options == 'string' ? JSON.parse((filterResult as any).options) : filterResult['options'];
    if (result.options && result.options.length) { 
      result.options.forEach((element: any) => {        
        this.addOption(element.option);
      });
    }
    const obj = Object.fromEntries(Object.entries(result).filter(f => f[0] != 'options'))
    this.questionForm.patchValue({
      ...obj
    })
    const opt = this.dialog.open(this.callAPIDialog);
    opt.afterClosed().subscribe(o => {
      while(this.options.length) {
        this.options.removeAt(0)
      }
    })
  }
}
