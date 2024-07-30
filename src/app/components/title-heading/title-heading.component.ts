import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { TitleHeadingService } from '../../shared/services/title-heading/title-heading.service';
import { SnackbarService } from '../../shared/signal-service/snackbar.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorConfig, NgxSimpleTextEditorModule, ST_BUTTONS } from 'ngx-simple-text-editor';

@Component({
  selector: 'app-title-heading',
  standalone: true,
  imports: [SharedModule, CommonModule, NgxSimpleTextEditorModule],
  templateUrl: './title-heading.component.html',
  styleUrl: './title-heading.component.scss'
})
export class TitleHeadingComponent {
  @ViewChild('openHeaderTitle') openHeaderTitle!: TemplateRef<any>;
  @ViewChild('previewHeaderTitle') previewHeaderTitle!: TemplateRef<any>;
  sanitizer = inject(DomSanitizer);
  imgViewer = '';
  headerType = '';
  displayedColumns = ['title', 'description', 'action'];
  dataSource = new MatTableDataSource();
  uploadedFile: Blob = new Blob();
  htmlContent: string | SafeHtml = '';
  breadcrumbData: IBreadcrumb = {
    title: 'Title Heading',
    list: [{
      routerLink: '/titleHeader',
      subTitle: 'Title-Heading',
      isRoute: true
    }]
  };
  headerList = [
    {
      label: 'Admission Form',
      value: 'admission'
    },
    {
      label: 'Receipt Form',
      value: 'receipt'
    }
  ];
  config: EditorConfig = {
    placeholder: 'Type something...',
    buttons: ST_BUTTONS,
  };
  constructor(private dialog: MatDialog,
    private titleHeadingService: TitleHeadingService,
    private spinnerService: SpinnerService,
    private snackbar: SnackbarService,
    private breadcrumb: BreadCrumbService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
  }

  ngOnInit(): void {
    this.getTitleList();
  }

  getTitleList(): void {
    this.spinnerService.show();
    this.titleHeadingService.getTitleHeader().subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        if (res.result?.length) {
          this.dataSource.data = res.result!.map(t => {
            return {
              ...t,
              description: this.returnHTML(t.description)
            }
          });
        }
      },
      error: (res) => {
        this.spinnerService.dispose();
      }
    })
  }

  getTitle(query: string): void {
    this.spinnerService.show();
    this.titleHeadingService.getByQueryTitleHeader(query).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.imgViewer = this.returnBase64(res.result?.photo!);
        this.headerType = res.result?.title!;
        this.htmlContent = res.result?.description!;
      },
      error: (res) => {
        this.spinnerService.dispose();
      }
    })
  }

  imageUpload(event: any): void {
    const file = event.target.files;
    this.uploadedFile = file;
    this.imgViewer = window.URL.createObjectURL(file[0]);
  }

  imageClickable(): void {
    document.getElementById('filepaths')?.click();
  }

  saveHeaderTitle(): void {
    let fileSelected: any;
    fileSelected = document.getElementById('filepaths');
    fileSelected = fileSelected.files;
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
      }, 500)
    }
    else {
        const img  = this.imgViewer.split(',')[1];
        this.save(img);
    }
  }

  save(base64File?: string): void {
    let payload = {
      title: this.headerType,
      description: this.htmlContent,
    };
    const formData = new FormData();
    if (base64File)
    formData.set("file", base64File);
    formData.set("titlePayload", JSON.stringify(payload));
    this.spinnerService.show();
    this.titleHeadingService.saveTitleHeader(formData).subscribe({
      next: (res) => {
        this.spinnerService.dispose();
        this.snackbar.openSuccessSnackbar(res.result!);
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  addEditTitleHeader(item?: {title: string}): void {
    this.htmlContent = '';
    this.dialog.open(this.openHeaderTitle);
    if (item) {
      this.getTitle(item.title);
    }
  }

  viewTitleHeader(item: {description: string}): void {
    this.dialog.open(this.previewHeaderTitle);
    this.htmlContent = item.description;
  }

  returnBase64(photo: string): string{
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(photo) as any).changingThisBreaksApplicationSecurity
  }

  returnHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
