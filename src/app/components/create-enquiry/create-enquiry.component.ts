import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { EnquiryService } from '../../shared/services/enquiry/enquiry.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-enquiry',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-enquiry.component.html',
  styleUrl: './create-enquiry.component.scss'
})
export class CreateEnquiryComponent {

  enquiryForm = new FormGroup({
    id: new FormControl<number>(0),
    firstName: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    dob: new FormControl<string>(''),
    mobile: new FormControl<string>(''),
    guardian: new FormControl<string>(''),
    className: new FormControl<string>(''),
    reference: new FormControl<string>(''),
    address: new FormControl<string>(''),
    status: new FormControl<boolean>(true)
  });

  classList = [
    {value: '1', label: 'I'},
    {value: '2', label: 'II'},
    {value: '3', label: 'III'},
    {value: '4', label: 'IV'},
    {value: '5', label: 'V'},
    {value: '6', label: 'VI'},
    {value: '7', label: 'VII'},
  ];

  statusList = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'},
  ];

  constructor(private service: EnquiryService,
      private snackbar: MatSnackBar) {}

  onSubmit() {
    let payload = this.enquiryForm.value
    this.service.create(payload).subscribe((res) => {
      if (res) {
        this.snackbar.open("Created Successfully", "Close", {duration: 2000})
      }
    })
  }
}
