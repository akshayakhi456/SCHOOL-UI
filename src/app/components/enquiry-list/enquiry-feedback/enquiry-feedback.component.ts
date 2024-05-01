import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { AuthenticationService } from '../../../shared/services/authentication/authentication.service';
import { EnquiryService } from '../../../shared/services/enquiry/enquiry.service';
import { IEnquiryFeedback } from '../../../shared/models/enquiry.models';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';

@Component({
  selector: 'app-enquiry-feedback',
  standalone: true,
  imports: [SharedModule, MatDialogModule, CommonModule],
  templateUrl: './enquiry-feedback.component.html',
  styleUrl: './enquiry-feedback.component.scss'
})
export class EnquiryFeedbackComponent {
  feedback = new FormControl();
  feedbackList: Array<IEnquiryFeedback> | undefined = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: number},
  private enquiryService: EnquiryService,
  private authService: AuthenticationService,
  private snackbar: SnackbarService,
  private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    if(this.data.id) {
      this.getFeedBackList();
    }
  }

  saveFeedBack(): void {
    const payload: IEnquiryFeedback = {
      id: 0,
      enquiryId: this.data.id,
      feedback: this.feedback.value,
      createdAt: new Date(),
      createdBy: this.authService.userName()
    }
    this.spinnerService.show();
    this.enquiryService.saveFeedBack(payload).subscribe(
      {
        next: (res) => {
          this.spinnerService.dispose();
          if(res.statusCode == HTTP_CODES.SUCCESS) {
            this.snackbar.openSuccessSnackbar(res.message);
            this.feedback.setValue('');
            this.getFeedBackList();
          }
        },
        error: () => {
          this.spinnerService.dispose()
        }
      }
    )
  }

  getFeedBackList(): void {
    this.spinnerService.show();
    this.enquiryService.getFeedBackList(this.data.id).subscribe(
      {
        next: (res) => {
          this.spinnerService.dispose();
          if(res.statusCode == HTTP_CODES.SUCCESS) {
            this.feedbackList = res.result;
          }
        },
        error: () => {
          this.spinnerService.dispose()
        }
      }
    )
  }
}
