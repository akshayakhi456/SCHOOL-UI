import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todays-collection',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './todays-collection.component.html',
  styleUrl: './todays-collection.component.scss'
})
export class TodaysCollectionComponent {
  timeList = [
    {value: 'Today', viewValue: 'Today'},
    {value: 'Yesterday', viewValue: 'Yesterday'},
  ];

  constructor(private router: Router) {}

  redirectToReport(): void {
    this.router.navigate(['/collection-report']);
  }
}
