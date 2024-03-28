import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-class-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './class-settings.component.html',
  styleUrl: './class-settings.component.scss'
})
export class ClassSettingsComponent {
  classes!: FormArray;
  className = new FormControl('');
  classSettingsForm = new FormGroup({
    classes: new FormArray([])
  })

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.classes = this.classSettingsForm.get('classes') as FormArray;
  }

  addClassList() {
    if (!this.className.value){
      return;
    }
    this.classes.push(new FormGroup({
      className: new FormControl(this.className.value),
      sections: new FormArray([])
    }));
    this.className.setValue('');
  }

  removeClass(i: number) {
    this.classes.removeAt(i);
  }

  sectionList(index: number): FormArray {
    return this.classes
      .at(index)
      .get('sections') as FormArray ?? [];
  }

  removeSectionItem(classIndex:number, sectionIndex: number) {
    const section = this.classes
    .at(classIndex)
    .get('sections') as FormArray;
    section.removeAt(sectionIndex);
  }

  addSectionList(index: number) {
    const subItems = (this.classSettingsForm.get('classes') as FormArray).at(index).get('sections') as FormArray;
    subItems.push(new FormGroup({
      sectionName: new FormControl('')
    }));
  }
}
