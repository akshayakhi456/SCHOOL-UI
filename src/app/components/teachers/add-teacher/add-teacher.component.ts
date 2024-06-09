import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { TeacherService } from '../../../shared/services/teacher/teacher.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HTTP_CODES } from '../../../shared/constants/common.constants';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [
    SharedModule, 
    CommonModule, 
    AsyncPipe, 
    NgxMaskDirective, 
    NgxMaskPipe,
  ],
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss',
  providers: [provideNgxMask()]
})
export class AddTeacherComponent {
  teacherForm = new FormGroup({
    id: new FormControl(0),
    empId: new FormControl(''),
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    fatherName: new FormControl<string>('', Validators.required),
    dateOfBirth: new FormControl(new Date(), Validators.required),
    phoneNumber: new FormControl<number | null>(null, Validators.required),
    email: new FormControl(),
    qualification: new FormControl(),
    passOutYear: new FormControl(),
    designation: new FormControl(),
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
    private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number}
  ) {
    if (data?.id) {
      this.getTeacherDetails(data.id);
    }
  }

  onAddExperience() {
    this.addExperienceFormArray.push(this.createExperienceFormGroup());
  }

  onRemoveExperience(rowIndex:number){
    this.addExperienceFormArray.removeAt(rowIndex);
  }

  createExperienceFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      empId: new FormControl(''),
      schoolName: new FormControl(),
      startEndDate: new FormControl(),
      designation: new FormControl(),
      status: new FormControl(true)
    });
  }

  saveTeacherInfo(): void {
    const payload = {
      teacherDetails: {
        id: this.teacherForm.value.id!,
        empId: this.teacherForm.value.empId!,
        firstName: this.teacherForm.value.firstName!,
        lastName: this.teacherForm.value.lastName!,
        fatherName: this.teacherForm.value.fatherName!,
        dateOfBirth: new Date(this.teacherForm.value.dateOfBirth!),
        phoneNumber: this.teacherForm.value.phoneNumber!,
        email: this.teacherForm.value.email!,
        qualification: this.teacherForm.value.qualification!,
        passOutYear: this.teacherForm.value.passOutYear!,
        designation: this.teacherForm.value.designation!
      },
      teacherExperience: this.teacherForm.value.experienceDetail!
    }
    this.spinnerService.show();
    if (this.teacherForm.value.id) {
      this.teacherService.updateTeacher(payload).subscribe({
        next: (res) => {
          if (res.statusCode == HTTP_CODES.SUCCESS) {
            this.spinnerService.dispose();
            this.snackbar.openSuccessSnackbar(res.result!);
          }
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

  getTeacherDetails(id: number): void {
    this.spinnerService.show();
    this.teacherService.getTeacherById(id).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.teacherForm.patchValue({
          ...res.result?.teacherDetails
        })
        if (res.result?.teacherExperience?.length) {
          const experience = res.result?.teacherExperience;
          for(let i=0; i< experience.length; i++) {
            this.addExperienceFormArray.push(
              new FormGroup({
              id: new FormControl(experience[i].id),
              empId: new FormControl(experience[i].empId),
              schoolName: new FormControl(experience[i].schoolName),
              startEndDate: new FormControl(experience[i].startEndDate),
              designation: new FormControl(experience[i].designation),
              status: new FormControl(experience[i].status)
              })
            )
          }
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }
}
