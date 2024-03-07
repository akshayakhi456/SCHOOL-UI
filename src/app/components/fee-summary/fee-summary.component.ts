import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-summary',
  standalone: true,
  imports: [CommonModule,
  SharedModule],
  templateUrl: './fee-summary.component.html',
  styleUrl: './fee-summary.component.scss'
})
export class FeeSummaryComponent {

  constructor(private router: Router) {}
  
  navigateToDetail(): void {
    this.router.navigate(['/fee-detail']);
  }

}
