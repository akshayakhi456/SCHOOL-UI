import { Component, EventEmitter, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../shared/signal-service/global.service';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.scss'
})
export class HeaderComponentComponent {
  menuStatus = true;
  globalservice = inject(GlobalService)

  opencloseSideNav() {
    this.globalservice.headerMenuClick.set(this.menuStatus = !this.menuStatus);
  }
}
