import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../../shared.module';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss'
})
export class AlertMessageComponent {
  dialogResultSubject = new Subject<boolean>();
  dialogResult$ = this.dialogResultSubject.asObservable();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: DialogRef) {}

  onSuccess(): void {
    this.dialogResultSubject.next(true);
  }
}
