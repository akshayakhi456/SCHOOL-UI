import { Component, TemplateRef, inject, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.scss'
})
export class ApplyLeaveComponent {
  @ViewChild('openApplyLeave') openApplyLeave! : TemplateRef<any>;
  dialog = inject(MatDialog);
  displayedColumns = ['rollNo', 'purposeOfLeave', 'dateRangeOfLeave', 'status', 'remarks'];
  dataSource = new MatTableDataSource();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  openAppplyLeave() {
    const dialog = this.dialog.open(this.openApplyLeave, {
      width: '40vw',
      height: '100vh',
      position: {
        right: '0'
      }
    })
  }
}
