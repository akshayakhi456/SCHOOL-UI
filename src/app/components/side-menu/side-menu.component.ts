import { Component, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { TokenService } from '../../shared/services/token/token.service';
import { GlobalService } from '../../shared/signal-service/global.service';

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
      routerLink: 'dashboard'
    },
    {
      isSubMenu: true,
      icon: 'bi bi-file-person-fill',
      dropdownIcon: 'bi bi-caret-down fs-16 float-end',
      title: 'Students',
      isExpanded: false,
      isActive: true,
      subList: [
        {
          title: 'Enquiry Form',
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
    }
  ]

  constructor(private router: Router, 
    private service: GlobalService,
    private tokenService: TokenService) {
    effect(() =>{
      console.log(this.service.headerMenuClick());
      this.openMenu = this.service.headerMenuClick();
    })
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

