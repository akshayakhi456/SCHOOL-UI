import { Component, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from '../../../shared/services/settings/settings.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('paginator') paginator!: MatPaginator | null;
  className = new FormControl('', Validators.required);
  sectionName = new FormControl('', Validators.required);
  isEditSectionMode = false;
  openedClass = null;
  pageSizes = [10, 25, 50, 100];
  displayedColumns: string[] = ['className', 'action'];
  displayedSectionColumns: string[] = ['section', 'action'];
  classDataSource = new MatTableDataSource([]);
  sectionDataSource = new MatTableDataSource([]);
  questionForm = new FormGroup({});
  isEditMode= false;
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private service: SettingsService,
    private router: Router,
    private snackbar:MatSnackBar,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild('sectionSort') sectionSort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.classDataSource.sort = this.sort;
    this.sectionDataSource.sort = this.sort;
    this.getClassList();
  }

  getClassList() {
    this.service.getClasses().subscribe((res) => {
      this.classDataSource.data = (res.result ?? res).map((x: any) => {
        return {
          ...x,
          isEditMode: false
        }
      });
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
    this.service.getSectionByClassName(this.openedClass!['className']).subscribe((res) => {
      this.sectionDataSource.data = (res.res ?? res).map((x: any) => {
        return {
          ...x,
          isEditSectionMode: false
        }
      });
      // this.sectionDataSource.paginator = this.paginator;
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

  updateClass(element: any) {
    if (element.className) {
      this.service.updateClass({id: element.id, className: element.className}).subscribe(res=>{
        this.snackbar.open('Updated Successfully');
        this.getClassList();
      })
    }
  }

  updateSection(element: any) {
    if (element.section) {
      this.service.updateSection({id: element.id, section: element.section, className: element.className}).subscribe(res=>{
        this.snackbar.open('Updated Successfully');
        element.isEditSectionMode = !element.isEditSectionMode;
        this.getSectionList();
      })
    }
  }

  saveSection() {
    this.sectionName.markAsTouched();
    if (this.sectionName.invalid) {
      return
    }
    this.service.createSection({id: 0, section: this.sectionName.value, className: this.openedClass!['id']}).subscribe(res=>{
      this.sectionName.setValue('');
      this.snackbar.open('Created Successfully');
      this.getSectionList();
    })
  }

  saveClass() {
    this.className.markAsTouched();
    if (this.className.invalid) {
      return
    }
    this.service.createClass({id: 0, className: this.className.value}).subscribe(res=>{
      this.snackbar.open(res.message);
      this.getClassList();
    })
  }
}
