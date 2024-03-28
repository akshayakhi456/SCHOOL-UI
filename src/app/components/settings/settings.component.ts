import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClassSettingsComponent } from './class-settings/class-settings.component';
import { EnquiryFormQuestionsComponent } from './enquiry-form-questions/enquiry-form-questions.component';

export interface ClassInfo {
  className: string;
  sections: Array<string>;
  feeStructure: Array<string>;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule, CommonModule, MatFormFieldModule, ClassSettingsComponent, EnquiryFormQuestionsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  className = new FormControl();

  items!: FormArray;
  settingsForm: FormGroup = new FormGroup({
    classes: new FormArray([])
  });

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.items = this.settingsForm.get('classes') as FormArray;
  }

  sectionList(empIndex: number): FormArray {
    return this.items
      .at(empIndex)
      .get('sections') as FormArray ?? [];
  }

  feeList(empIndex: number): FormArray {
    // return ((this.settingsForm.controls['classes'] as any)['controls'] as any)[empIndex].controls.feeNames
    return this.items
      .at(empIndex)
      .get('feeNames') as FormArray ?? [];
  }

  subFeeList(empIndex: number, subFeeIndex: number): FormArray {
    // return ((this.settingsForm.controls['classes'] as any)['controls'] as any)[empIndex].controls.feeNames.controls[subFeeIndex].controls.subFeeNames
    return (this.feeList(empIndex))
      .at(subFeeIndex)
      .get('subFeeNames') as FormArray ?? [];
  }

  addClassList() {
    this.items.push(new FormGroup({
      className: new FormControl(this.className.value),
      sections: new FormArray([]),
      feeNames: new FormArray([])
    }));
  }

  addSectionList(index: number) {
    const subItems = this.items.at(index).get('sections') as FormArray;
    subItems.push(new FormGroup({
      sectionName: new FormControl('')
    }));
  }

  removeSectionItem(itemIndex: number, subItemIndex: number) {
    const subItems = this.items.at(itemIndex).get('sections') as FormArray;
    subItems.removeAt(subItemIndex);
  }

  addFeeList(index: number) {
    const subItems = this.items.at(index).get('feeNames') as FormArray;
    subItems.push(new FormGroup({
      feeName: new FormControl(''),
      amount: new FormControl(''),
      isTotal: new FormControl(false),
      subFeeNames: new FormArray([])
    }));
  }

  removeFeeName(itemIndex: number, subItemIndex: number) {
    const subItems = this.items.at(itemIndex).get('feeNames') as FormArray;
    subItems.removeAt(subItemIndex);
  }

  addSubFeeName(index: number, subIndex: number) {
    const subItems = this.subFeeList(index,subIndex);
    if(subItems){
      subItems.push(new FormGroup({
        subFeeName: new FormControl('')
      }));
      subItems.at(subItems.length - 1).updateValueAndValidity({emitEvent: true})
    }
  }

  removeSubFeeName(itemIndex: number, subItemIndex: number, subSubItemIndex: number) {
    const subItems = (this.items.at(itemIndex).get('feeNames') as FormArray).at(subItemIndex).get('subFeeNames') as FormArray;
    subItems.removeAt(subSubItemIndex);
  }
}
