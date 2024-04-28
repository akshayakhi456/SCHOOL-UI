import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { SaveUserAccountComponent } from '../save-user-account/save-user-account.component';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IBreadcrumb } from '../../shared/interfaces/global.model';
import { BreadCrumbService } from '../../shared/signal-service/breadcrumb.service';

@Component({
  selector: 'app-user-accounts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-accounts.component.html',
  styleUrl: './user-accounts.component.scss'
})
export class UserAccountsComponent implements OnInit{
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userAccountDataSource = new MatTableDataSource();
  userAccountDisplayedColumns: Array<string> = ['userName', 'email', 'role', 'action'];
  pageSizes = [10,25,50];
  breadcrumbData: IBreadcrumb = {
    title: 'User Account List',
    list: [{
      routerLink: '/userAccounts',
      subTitle: 'user-Accounts',
      isRoute: true
    }]
  }
  constructor(private dialog: MatDialog,
    private authService: AuthenticationService,
    private spinnerService: SpinnerService,
    private breadcrumb: BreadCrumbService
  ) {
    breadcrumb.setBreadcrumb(true, this.breadcrumbData);
  }
  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.spinnerService.show();
    this.authService.getUserDetails().subscribe({
      next: (res: any) => {
        this.spinnerService.dispose();
        this.userAccountDataSource.data = res.result;
        this.userAccountDataSource.sort = this.sort;
        this.userAccountDataSource.paginator = this.paginator;
      },
      error: () => {
        this.spinnerService.dispose();
      }
    })
  }

  userCreate(): void {
    this.dialog.open(SaveUserAccountComponent);
  }
}
