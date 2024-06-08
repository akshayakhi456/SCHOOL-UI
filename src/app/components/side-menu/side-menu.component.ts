import { Component, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { TokenService } from '../../shared/services/token/token.service';
import { GlobalService } from '../../shared/signal-service/global.service';
import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { ROLES } from '../../shared/models/common.models';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterOutlet],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  openMenu = false;
  menuList = [
    {
      isSubMenu: false,
      icon: 'bi bi-grid',
      dropdownIcon: '',
      title: 'Dashboard',
      isExpanded: false,
      isActive: true,
      routerLink: 'dashboard',
      role: [ROLES.ADMIN, ROLES.OWNER],
      isDisplay: false,
    },
    {
      isSubMenu: true,
      icon: 'bi bi-file-person-fill',
      dropdownIcon: 'bi bi-caret-down fs-16 float-end',
      title: 'Students',
      isExpanded: false,
      isActive: true,
      role: [ROLES.ADMIN, ROLES.OWNER],
      isDisplay: false,
      subList: [
        {
          title: 'Enquiry List',
          routerLink: '/enquiry-list',
        },
        {
          title: 'Admission',
          routerLink: '/admission',
        },
        {
          title: 'Student List',
          routerLink: '/student-list',
        }
      ]
    },
    {
      isSubMenu: true,
      icon: 'bi bi-file-person-fill',
      dropdownIcon: 'bi bi-caret-down fs-16 float-end',
      title: 'Teacher',
      isExpanded: false,
      isActive: true,
      role: [ROLES.ADMIN, ROLES.OWNER],
      isDisplay: false,
      subList: [
        {
          title: 'Teacher List',
          routerLink: '/teacher-list',
        },
        {
          title: 'Teacher Detail',
          routerLink: '/teacher-detail',
        },
        {
          title: 'Class Subject',
          routerLink: '/class-subject',
        }
      ]
    },
    {
      isSubMenu: false,
      icon: 'bi bi-person-lines-fill',
      dropdownIcon: '',
      title: 'Student Profile',
      isExpanded: false,
      isActive: true,
      routerLink: 'student-profile',
      role: [ROLES.ADMIN, ROLES.OWNER, ROLES.TEACHER, ROLES.PARENT],
      isDisplay: false,
    },
    {
      isSubMenu: true,
      icon: 'bi bi-award',
      dropdownIcon: 'bi bi-caret-down fs-16 float-end',
      title: 'Student Academics',
      isExpanded: false,
      isActive: true,
      role: [ROLES.ADMIN, ROLES.OWNER, ROLES.TEACHER, ROLES.PARENT],
      isDisplay: false,
      subList: [
        {
          title: 'View Attendance',
          routerLink: '/viewAttendance',
        },
        {
          title: 'View Progress',
          routerLink: '/viewProgress',
        },
        {
          title: 'Apply Leave',
          routerLink: '/applyLeave',
        }
      ]
    },
    {
      isSubMenu: true,
      icon: 'bi bi-kanban-fill',
      dropdownIcon: 'bi bi-caret-down fs-16 float-end',
      title: 'Class',
      isExpanded: false,
      isActive: true,
      role: [ROLES.ADMIN, ROLES.OWNER, ROLES.TEACHER],
      isDisplay: false,
      subList: [
        {
          title: 'Mark Attendance',
          routerLink: '/mark-attendance',
        },
        {
          title: 'Section Assignment',
          routerLink: '/section-assignment',
        },
        {
          title: 'Add Marks',
          routerLink: '/add-marks',
        },
        {
          title: 'Exam Subject',
          routerLink: '/exam-subject',
        },
        {
          title: 'Progress Report',
          routerLink: '/progress-report',
        }
      ]
    }
  ]

  constructor(private router: Router,
    public authentication: AuthenticationService,
    private service: GlobalService,
    private tokenService: TokenService) {
    effect(() =>{
      this.openMenu = this.service.headerMenuClick();
    })
  }

  ngAfterViewInit(): void {
    const role = this.authentication.role();
    if(role) {
      this.menuList.forEach(item =>{
        item.isDisplay = item.role?.includes(role)
      })
    }
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  signOut(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}

