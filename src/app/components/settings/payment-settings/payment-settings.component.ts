import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';

@Component({
  selector: 'app-payment-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss'
})
export class PaymentSettingsComponent {
  @ViewChild('openPaymentAllotment') openPaymentAllotment!: TemplateRef<any>;
  displayedColumns: string[] = ['className', 'action'];
  displayedPaymentColumns: string[] = ['paymentName', 'amount', 'action'];
  classDataSource = new MatTableDataSource([]);
  paymentDataSource = new MatTableDataSource([]);
  paymentName = new FormControl('', Validators.required);
  amount = new FormControl('', Validators.required);
  selectedClass = '';
  isEditMode= false;
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: SettingsService,
    private spinnerService: SpinnerService,
    private snackbar:MatSnackBar,
    public dialog: MatDialog) {}

  @ViewChild('feeNameSort') sort: MatSort = new MatSort();

  ngOnInit() {
    this.getClassList();
  }

  getClassList() {
    this.spinnerService.show();
    this.service.getClasses().subscribe({next: (res) => {
      this.spinnerService.dispose();
      this.classDataSource.data = res.result ?? res;
    },error: ()=>{
      this.spinnerService.dispose();
    }});
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

  allotment(element: any){
    this.selectedClass = element.className;
    this.getPaymentAllotment();
    const dialog = this.dialog.open(this.openPaymentAllotment, {
      width: '60vw'
    })
    dialog.afterClosed().subscribe(res => {
      this.selectedClass = '';
      this.paymentName.setValue('');
      this.amount.setValue('');
    })
  }

  getPaymentAllotment(){
    this.spinnerService.show();
    this.service.getPaymentAllotment(this.selectedClass).subscribe({next: res => {
      this.spinnerService.dispose();
      this.paymentDataSource.data = res.result.map((x: any) => {
        return {
          ...x,
          isEditPaymentNameMode: false
        }
      });
    },error: ()=>{
      this.spinnerService.dispose();
    }})
  }

  savePaymentAlloted(){
    this.paymentName.markAsTouched();
    this.amount.markAsTouched();
    if (this.paymentName.valid && this.amount.valid) {
      const payload = {
        paymentName: this.paymentName.value,
        amount: this.amount.value,
        className: this.selectedClass,
        acedamicYearId: 1
      }
      this.service.createPaymentAllotment(payload).subscribe(res => {
        this.snackbar.open(res.message, 'Close', {duration:2000});
        this.getPaymentAllotment();
        this.paymentName.reset();
        this.amount.reset();
      })
    }
  }

  updatePaymentAlloted(element: any){
    if (element.paymentName && element.amount) {
      const payload = {
        id: element.id,
        paymentName: element.paymentName,
        amount: element.amount,
        className: this.selectedClass
      }
      this.spinnerService.show();
      this.service.updatePaymentAllotment(payload).subscribe(res => {
      this.spinnerService.dispose();
        this.snackbar.open(res.message, 'Close', {duration:2000});
        element.isEditPaymentNameMode = !element.isEditPaymentNameMode
      },()=>{
      this.spinnerService.dispose();
      })
    }
  }
}
