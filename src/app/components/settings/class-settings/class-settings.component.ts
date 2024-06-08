import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../shared/services/spinner/spinner.service';
import { SnackbarService } from '../../../shared/signal-service/snackbar.service';
import { SubjectService } from '../../../shared/services/subject/subject.service';
import { IClassWiseSubject } from '../../../shared/models/subject.models';
import { HTTP_CODES } from '../../../shared/constants/common.constants';
import { ISubjectModel } from '../../../shared/models/setting.models';

@Component({
  selector: 'app-class-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './class-settings.component.html',
  styleUrl: './class-settings.component.scss'
})
export class ClassSettingsComponent {
  @ViewChild('openClassPopup') openClassPopup!: TemplateRef<any>;
  @ViewChild('openSectionPopup') openSectionPopup!: TemplateRef<any>;
  @ViewChild('openSubjectPopup') openSubjectPopup!: TemplateRef<any>;
  @ViewChild('paginator') paginator!: MatPaginator | null;
  className = new FormControl('', Validators.required);
  sectionName = new FormControl('', Validators.required);
  subjectName = new FormControl('', [Validators.required]);
  isEditSectionMode = false;
  openedClass: {id: number; className: string} | null = null;
  pageSizes = [10, 25, 50, 100];
  displayedColumns: string[] = ['className', 'action'];
  displayedSectionColumns: string[] = ['section', 'action'];
  displayedSubjectColumns: string[] = ['subject', 'action'];
  classDataSource = new MatTableDataSource([]);
  sectionDataSource = new MatTableDataSource([]);
  subjectDataSource = new MatTableDataSource<IClassWiseSubject>([]);
  questionForm = new FormGroup({});
  isEditMode= false;
  subjectList: Array<ISubjectModel> = [];
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: SettingsService,
    private subject: SubjectService,
    private router: Router,
    private snackbar:SnackbarService,
    private spinnerService: SpinnerService,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild('sectionSort') sectionSort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.classDataSource.sort = this.sort;
    this.sectionDataSource.sort = this.sort;
    this.getClassList();
    this.getSubjectList();
  }

  getClassList() {
    this.spinnerService.show();
    this.service.getClasses().subscribe((res) => {
      this.spinnerService.dispose();
      this.classDataSource.data = (res.result ?? res).map((x: any) => {
        return {
          ...x,
          isEditMode: false
        }
      });
    },()=>{
      this.spinnerService.dispose();
    })

  }

  getSubjectList(): void {
    this.spinnerService.show();
    this.service.subjectList().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.statusCode == HTTP_CODES.SUCCESS) {
          this.subjectList = res.result!;
        }
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
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

  classModal() {
    this.dialog.open(this.openClassPopup)
  }

  openClassModal(element: any) {
    element.isEditSectionMode = !element.isEditSectionMode
    this.dialog.open(this.openClassPopup)
  }

  getSectionList() {
    this.spinnerService.show();
    this.service.getSectionByClassName(this.openedClass!['className']).subscribe((res) => {
      this.spinnerService.dispose();
      this.sectionDataSource.data = (res.res ?? res).map((x: any) => {
        return {
          ...x,
          isEditSectionMode: false
        }
      });
      // this.sectionDataSource.paginator = this.paginator;
    },()=>{
      this.spinnerService.dispose();
    })
  }

  openSectionModal(element: any) {
    this.openedClass = element
    this.getSectionList();
    const dialog = this.dialog.open(this.openSectionPopup, {
      width: '40vw',
      height: '40vw'
    })


    dialog.afterClosed().subscribe(() => {
      this.openedClass = null;
    })
  }

  openSubjectModal(element: any) {
    this.openedClass = element;
    this.subjectName.reset();
    this.getSubject();
    const dialog = this.dialog.open(this.openSubjectPopup, {
      width: '40vw',
      height: '40vw'
    })


    dialog.afterClosed().subscribe(() => {
      this.openedClass = null;
    })
  }

  updateClass(element: any) {
    if (element.className) {
      this.spinnerService.show();
      this.service.updateClass({id: element.id, className: element.className}).subscribe(res=>{
        this.spinnerService.dispose();
        this.snackbar.openSuccessSnackbar('Updated Successfully');
        this.getClassList();
      },()=>{
        this.spinnerService.dispose();
      })
    }
  }

  updateSection(element: any) {
    if (element.section) {
      this.spinnerService.show();
      this.service.updateSection({id: element.id, section: element.section, className: element.className}).subscribe(res=>{
        this.spinnerService.dispose();
        this.snackbar.openSuccessSnackbar('Updated Successfully');
        element.isEditSectionMode = !element.isEditSectionMode;
        this.getSectionList();
      },()=>{
        this.spinnerService.dispose();
      })
    }
  }

  saveSection() {
    this.sectionName.markAsTouched();
    if (this.sectionName.invalid) {
      return
    }
    this.spinnerService.show();
    this.service.createSection({id: 0, section: this.sectionName.value, className: this.openedClass!['className']}).subscribe({next: res=>{
      this.spinnerService.dispose();
      this.sectionName.setValue('');
      this.snackbar.openSuccessSnackbar('Created Successfully');
      this.getSectionList();
    },error: ()=>{
      this.spinnerService.dispose();
    }})
  }

  saveClass() {
    this.className.markAsTouched();
    if (this.className.invalid) {
      return
    }
    this.spinnerService.show();
    this.service.createClass({id: 0, className: this.className.value}).subscribe(res=>{
      this.spinnerService.dispose();
      this.snackbar.openSuccessSnackbar(res.message);
      this.getClassList();
    },()=>{
      this.spinnerService.dispose();
    })
  }

  getSubject(): void {
    this.spinnerService.show();
    this.subject.getClassWiseSubjects(this.openedClass!['id'], 1).subscribe({
      next: (res) =>{
        this.spinnerService.dispose();
        this.subjectDataSource.data = res.result!;
      },
      error: () =>{
        this.spinnerService.dispose();
      }
    })
  }

  saveSubject() {
    this.subjectName.markAsTouched();
    if (this.subjectName.invalid) {
      return
    }
    const payload = {
      id: 0,
      subjectId: Number(this.subjectName.value),
      classId: this.openedClass!.id,
      academicYearId: 1
    }
    this.spinnerService.show();
    this.subject.postClassWiseSubject(payload).subscribe({
      next: res=>{
      this.spinnerService.dispose();
      this.snackbar.openSuccessSnackbar(res.result!);
      this.getSubject();
      this.subjectName.reset();
      },
      error: ()=>{
        this.spinnerService.dispose();
      }
    })
  }

  removeClassSubject(id: number) {
    this.spinnerService.show();
    this.subject.deleteClassWiseSubject(id).subscribe({
      next: res=>{
      this.spinnerService.dispose();
      this.snackbar.openSuccessSnackbar(res.result!);
      this.getSubject();
      },
      error: ()=>{
        this.spinnerService.dispose();
      }
    })
  }
}
