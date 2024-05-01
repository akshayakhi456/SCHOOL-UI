import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { AlertMessageComponent } from '../../components/alert-message/alert-message.component';
import { IDialogContent } from '../../models/common.models';

@Injectable({
  providedIn: 'root'
})
export class AlertmessageService {
  private dialogResultSubject!: Subject<boolean>;
  dialogResult$!: Observable<boolean>;
  constructor(private matDialog: MatDialog) { }

  openSuccessWithSubscriber(data: IDialogContent = {
    btnPrimaryText: 'Ok', 
    btnCancelText: 'Cancel',
    title: '',
    body: ''
  }) {
    data.btnCancelText = data.btnCancelText ?? 'Cancel';
    data.btnPrimaryText = data.btnPrimaryText ?? 'Ok';
    const dialogRef = this.matDialog.open(AlertMessageComponent, {
      data
    });
    this.dialogResultSubject = new Subject<boolean>();
    this.dialogResult$ = this.dialogResultSubject.asObservable()

    dialogRef.componentInstance.dialogResult$.subscribe((pressedButton: boolean) => {
      this.dialogResultSubject.next(pressedButton);
      this.dialogResultSubject.complete();
      dialogRef.close();
    });
    return this;
  }
}
