import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../shared/services/student/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {MatChipsModule} from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { SettingsService } from '../../shared/services/settings/settings.service';

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
  settingService = inject(SettingsService);
  spinnerService = inject(SpinnerService);
  snackbar = inject(MatSnackBar);
  activatedRoute = inject(ActivatedRoute);
  sanitizer = inject(DomSanitizer);
  spinner = inject(SpinnerService);
  orgSectionList = [];
  sectionList: any;
  classList: any;


  studentInfoForm = new FormGroup({
    id: new FormControl<number>(0),
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    dob: new FormControl<string>('', Validators.required),
    className: new FormControl<string>('', Validators.required),
    section: new FormControl<string>(''),
    gender: new FormControl<string>('', Validators.required),
    status: new FormControl<boolean>(true),
    adharNumber: new FormControl<string>('', [Validators.required,Validators.minLength(12), Validators.maxLength(12)]),
    sibilings: new FormControl<string>(''),
    certificateNames: new FormControl<string>('')
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
    this.getClassList();
    this.getSectionList();
    this.filteredSibiling = this.sibilingCtrl.valueChanges
      .pipe(
        startWith(''),
        map(sibiling => sibiling ? this.filterSibiling(sibiling) : this.students.slice())
      );
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.getStudentById(Number(id));
    }
    this.studentInfoForm.controls.className.valueChanges.subscribe(res => {
      this.sectionList = this.orgSectionList.filter(x => x['className'] == res)
    })
  }

  getStudentById(id: number) {
    this.spinner.show();
    this.service.getById(id).subscribe({next: res => {
      this.spinner.dispose();
      const result = res.result ?? res;
      const studentPhoto = result.students.photo;
      const studentBase64Photo = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(studentPhoto) as any).changingThisBreaksApplicationSecurity;
      const studentForm = result.students;
      this.imgViewer = studentBase64Photo;
      if (result.students.sibilings) {
        this.selectedStudents = JSON.parse(result.students.sibilings)
      }
      if (result.students.certificateNames) {
        this.certificateList = JSON.parse(result.students.certificateNames);
      }
      this.studentInfoForm.patchValue({
        ...studentForm,
        photo: ''
      });
      const fatherInfo = result.guardians.find((f: any) => f.relationship === 'Father');
      const motherInfo = result.guardians.find((f: any) => f.relationship === 'Mother');
      this.fatherInfoForm.patchValue({
        ...fatherInfo
      });
      this.motherInfoForm.patchValue({
        ...motherInfo
      });
      this.AddressInfoForm.patchValue({
        ...result.address
      });
    },
    error: () => {
      this.spinner.dispose();
    }
  })
  }

  getClassList() {
    this.spinnerService.show();
    this.settingService.getClasses().subscribe({next: res => {
      this.spinnerService.dispose();
      this.classList = res.map((r: any) => {
        return {
          label: r.className,
          value: r.className
        }
      })
    },error:()=>{
      this.spinnerService.dispose();
    }})
  }

  getSectionList() {
    this.spinnerService.show();
    this.settingService.getSections().subscribe({next: res => {
      this.spinnerService.dispose();
      this.orgSectionList = res.res.map((x: any) => {
        return {
          ...x,
          label: x.section,
          value: x.section
        }
      })
    },error:() =>{
      this.spinnerService.dispose();
    }})
  }

  getStudentsList(): void {
    this.spinner.show();
    this.service.get().subscribe({next: res => {
      this.spinner.dispose();
      this.students = res.map((x: any) => {
        return {
          ...x,
          userName: `${x.firstName} ${x.lastName}`
        }
      });
      this.sibilingCtrl.updateValueAndValidity({emitEvent: true});
    },error: ()=>{ this.spinner.dispose();}})
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
    let fileSelected: any;
    fileSelected = document.getElementById('filepaths');
    fileSelected = fileSelected.files;
    const id = this.activatedRoute.snapshot.params['id'];
    if (fileSelected.length > 0) {
      const fileToLoad = fileSelected[0];
      let fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEventTrigger) {
        let textAreaFileContents: any;
        textAreaFileContents = document.getElementById('filepaths');
        textAreaFileContents.innerHTML = fileLoadedEventTrigger.target?.result;
      }
      fileReader.readAsDataURL(fileToLoad);
      setTimeout(() =>{
        let fileTosaveName: any;
        fileTosaveName = (fileReader.result as string).split(',')[1];
        this.save(fileTosaveName);
      }, 5000)
    }
    else {
      let fileTosaveName: any;
      if (this.imgViewer) {
        fileTosaveName = (this.imgViewer as string).split(',')[1]
      }
      this.save(fileTosaveName);
    }
  }
  
  save(base64data: any) {
    const formData = new FormData();
    if (this.selectedStudents.length) {
      const sibilings = JSON.stringify(this.selectedStudents);
      this.studentInfoForm.patchValue({
        sibilings
      });
    }
    if (this.certificateList.length) {
      this.studentInfoForm.patchValue({
        certificateNames: JSON.stringify(this.certificateList)
      })
    }
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
      const id = this.activatedRoute.snapshot.params['id'];
      if (!id) {
        this.spinner.show();
        this.service.create(formData).subscribe({
          next: () => {
            this.spinner.dispose();
            this.snackbar.open('Created Successfully.', 'Close', {duration: 2000})
          },
          error: ()=>{ this.spinner.dispose();}
        })
      }
      else {
        this.spinner.show();
        this.service.update(formData).subscribe({
          next: () => {
            this.spinner.dispose();
            this.snackbar.open('Updated Successfully.', 'Close', {duration: 2000})
          },
          error: ()=>{ this.spinner.dispose();}
        })
      }
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

  imageClickable() {
    document.getElementById('filepaths')?.click();
  }
 
}
