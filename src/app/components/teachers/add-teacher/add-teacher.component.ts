import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { TeacherService } from '../../../shared/services/teacher/teacher.service';
import { subscribe } from 'diagnostics_channel';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss'
})
export class AddTeacherComponent {
  teacherForm = new FormGroup({
    id: new FormControl(),
    empId: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    dateOfBirth: new FormControl(),
    phoneNumber: new FormControl(),
    email: new FormControl(),
    qualification: new FormControl(),
    passOutYear: new FormControl(),
    experienceDetail: new FormArray([])
  })

  get addExperienceFormArray() {
    return this.teacherForm.get('experienceDetail') as FormArray;
  }

  get teacherFormControl() {
    return this.teacherForm.controls;
  }

  constructor(
    private spinnerService: SpinnerService,
    private teacherService: TeacherService,
    private snackbar: SnackbarService
  ) {}

  onAddExperience() {
    this.addExperienceFormArray.push(this.createExperienceFormGroup());
  }

  onRemoveExperience(rowIndex:number){
    this.addExperienceFormArray.removeAt(rowIndex);
  }

  createExperienceFormGroup(): FormGroup {
    return new FormGroup({
      schoolName: new FormControl(),
      noOfYears: new FormControl(),
      workingYear: new FormControl(),
      designation: new FormControl(),
      status: new FormControl(true)
    });
  }

  saveTeacherInfo(): void {
    const payload = {
      teacherDetails: {
        id: this.teacherForm.value.id,
        empId: this.teacherForm.value.empId,
        firstName: this.teacherForm.value.firstName,
        lastName: this.teacherForm.value.lastName,
        dateOfBirth: this.teacherForm.value.dateOfBirth,
        phoneNumber: this.teacherForm.value.phoneNumber,
        email: this.teacherForm.value.email,
        qualification: this.teacherForm.value.qualification,
        passOutYear: this.teacherForm.value.passOutYear,
      },
      teacherExperience: this.teacherForm.value.experienceDetail!
    }
    this.spinnerService.show();
    if (this.teacherForm.value.id) {
      this.teacherService.updateTeacher(payload).subscribe({
        next: (res) => {
          this.spinnerService.dispose();
          this.snackbar.openSuccessSnackbar(res.result!);
        },
        error: () => {
          this.spinnerService.dispose();
        }
      })
    }
    else {
      this.teacherService.addTeacher(payload).subscribe({
        next: (res) => {
          this.spinnerService.dispose();
          this.snackbar.openSuccessSnackbar(res.result!)
        },
        error: () => {
          this.spinnerService.dispose();
        }
      })
    }
  }

  getTeacherDetails(): void {
    this.spinnerService.show();
    this.teacherService.getTeacherById(1).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.teacherForm.patchValue({
          ...res.result?.teacherDetails
        })
        if (res.result?.teacherExperience?.length) {
          const experience = res.result?.teacherExperience;
          for(let i=0; i< experience.length; i++) {
            this.addExperienceFormArray.push({
              schoolName: experience[i].schoolName,
              // noOfYears: experience[i].startEndDate,
              workingYear: experience[i].startEndDate,
              designation: experience[i].designation,
              status: experience[i].status
            })
          }
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
}
