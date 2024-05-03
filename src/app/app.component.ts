import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponentComponent } from './components/header-component/header-component.component';
import { GlobalService } from './shared/signal-service/global.service';
import { RightSideNavComponent } from './components/right-side-nav/right-side-nav.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { TokenService } from './shared/services/token/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, 
    RouterOutlet, 
    SideMenuComponent, 
    HeaderComponentComponent, 
    RightSideNavComponent,
    BreadcrumbComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SCHOOL-UI';
  globalService = inject(GlobalService);
  tokenService = inject(TokenService);
  isOpen = false;
  constructor(private router: Router) {
    effect(() => {
      this.isOpen = this.globalService.headerMenuClick();
    })
  }
  isLogin(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('newPassword')
  }
}
