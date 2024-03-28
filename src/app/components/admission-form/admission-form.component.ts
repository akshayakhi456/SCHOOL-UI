import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../shared/services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [SharedModule, CommonModule, AsyncPipe, NgxMaskDirective, NgxMaskPipe, MatChipsModule],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss',
  providers: [provideNgxMask()]
})
export class AdmissionFormComponent {
  imgViewer = '';
  uploadedFile: Blob = new Blob();
  sibilingCtrl = new FormControl();
  filteredSibiling: Observable<any> = new Observable<any>;
  students: any = [];
  selectedStudents: any = [];
  certificate = new FormControl<string>('');
  certificateList: Array<string> = [];
  service = inject(StudentService);
  snackbar = inject(MatSnackBar);
  classList = [
    {value: '1', label: 'I'},
    {value: '2', label: 'II'},
    {value: '3', label: 'III'},
    {value: '4', label: 'IV'},
    {value: '5', label: 'V'},
    {value: '6', label: 'VI'},
    {value: '7', label: 'VII'},
  ];

  studentInfoForm = new FormGroup({
    id: new FormControl<number>(0),
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    dob: new FormControl<string>('', Validators.required),
    className: new FormControl<string>('', Validators.required),
    section: new FormControl<string>(''),
    gender: new FormControl<string>('', Validators.required),
    status: new FormControl<boolean>(true),
    adharNumber: new FormControl<string>('', [Validators.required,Validators.minLength(12), Validators.maxLength(12)])
  });

  fatherInfoForm = new FormGroup({
    id: new FormControl<number>(0),
    firstName: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    occupation: new FormControl<string>(''),
    qualification: new FormControl<string>(''),
    contactNumber: new FormControl<number | null>(null),
    email: new FormControl<string>(''),
    adharNumber: new FormControl<string>('', Validators.maxLength(12)),
    studentId: new FormControl<string>(''),
    relationship: new FormControl<string>('Father')
  });

  motherInfoForm = new FormGroup({
    id: new FormControl<number>(0),
    firstName: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    occupation: new FormControl<string>(''),
    qualification: new FormControl<string>(''),
    contactNumber: new FormControl<number | null>(null),
    email: new FormControl<string>(''),
    adharNumber: new FormControl<string>(''),
    studentId: new FormControl<string>(''),
    relationship: new FormControl<string>('Mother')
  });

  AddressInfoForm = new FormGroup({
    id: new FormControl<number>(0),
    houseNo: new FormControl<string>(''),
    streetName: new FormControl<string>(''),
    city: new FormControl<string>(''),
    district: new FormControl<string>(''),
    state: new FormControl<string>(''),
    zipCode: new FormControl<string>(''),
    country: new FormControl<string>(''),
    studentId: new FormControl<number>(0)
  });

  checkListForm = new FormGroup({
    checkList: new FormArray<any>([])
  })

  get studentForm():  { [key: string]: AbstractControl } {
    return this.studentInfoForm.controls;
  }
  get fatherForm():  { [key: string]: AbstractControl } {
    return this.fatherInfoForm.controls;
  }

  ngOnInit(): void {
    this.getStudentsList();
    this.filteredSibiling = this.sibilingCtrl.valueChanges
      .pipe(
        startWith(''),
        map(sibiling => sibiling ? this.filterSibiling(sibiling) : this.students.slice())
      );
  }

  getStudentsList(): void {
    this.service.get().subscribe({next: res => {
      this.students = res.map((x: any) => {
        return {
          ...x,
          userName: `${x.firstName} ${x.lastName}`
        }
      });
      this.sibilingCtrl.updateValueAndValidity({emitEvent: true});
    }})
  }

  addSibiling(): void {
    const obj = this.students.filter((x: {userName: string}) => x.userName === this.sibilingCtrl.value);
    if (obj && obj.length && !this.selectedStudents.includes(obj[0])){
      this.selectedStudents.push(...obj)
    }
    this.sibilingCtrl.setValue('');
  }

  removeSibiling(i: number): void {
    this.selectedStudents.splice(i,1)
  }

  OnSubmit(): void {
    if (this.studentInfoForm.invalid) {
      return;
    }
    const self = this;
    var reader = new FileReader();
    reader.readAsDataURL(this.uploadedFile); 
    reader.onloadend = function() {
      var base64data = reader.result;                
      console.log(base64data);
      self.save(base64data);
    }
  }
  
  save(base64data: any) {
    const formData = new FormData();
    formData.append('file', base64data)
      const payload = {
        students: this.studentInfoForm.value,
        guardians: [
          this.fatherInfoForm.value,
          this.motherInfoForm.value
        ],
        address: this.AddressInfoForm.value
      }
      formData.append('studentGuardian', JSON.stringify(payload));
      this.service.create(formData).subscribe({
        next: () => {
          this.snackbar.open('Created Successfully.', 'Close', {duration: 2000})
        }
      })
  }

  filterSibiling(value: string): Array<any> {
    const filterValue = value.toLowerCase();

    return this.students.filter((std: any) => std.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  get checkList() : FormArray {
    return this.checkListForm.controls.checkList as FormArray
  }
 
  newSkill(): FormGroup {
    return new FormGroup({
      certificate: new FormControl<string>(''),
    })
  }
 
  addcheckList() {
    const val = this.certificate.value;
    if (val && !this.certificateList.includes(val)) {
      this.certificateList.push(val);
    }
    this.certificate.setValue('');
  }

  removeCertificateList(i: number) {
    this.certificateList.splice(i, 1)
  }

  imageUpload(event: any) {
    const file = event.target.files;
    this.uploadedFile = file;
    this.imgViewer = window.URL.createObjectURL(file[0]);
  }
 
}
