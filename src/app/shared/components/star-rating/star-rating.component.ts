import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { SnackbarService } from '../../signal-service/snackbar.service';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
  @Input('rating') rating: number = 0;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  @Output() ratingUpdated = new EventEmitter();

  private snackBarDuration: number = 2000;
   ratingArr: Array<any> = [];

  constructor(private snackBar: SnackbarService) {
  }


  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating:number) {
    this.rating = rating;
    this.snackBar.openSuccessSnackbar('You rated ' + rating + ' / ' + this.starCount, '');
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star';
    }
  }
}
