import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {

}
