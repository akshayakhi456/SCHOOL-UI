import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-summary-detail',
  standalone: true,
  imports: [CommonModule,
  SharedModule],
  templateUrl: './fee-summary-detail.component.html',
  styleUrl: './fee-summary-detail.component.scss'
})
export class FeeSummaryDetailComponent {
  constructor(private router: Router) {}
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }
}
