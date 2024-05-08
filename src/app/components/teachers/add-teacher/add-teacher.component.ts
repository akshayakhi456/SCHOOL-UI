import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

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
    experienceDetail: new FormArray([])
  })

  get addExperienceFormArray() {
    return this.teacherForm.get('experienceDetail') as FormArray;
  }

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
      designation: new FormControl()
    });
  }
}
