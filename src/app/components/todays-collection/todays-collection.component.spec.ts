import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysCollectionComponent } from './todays-collection.component';

describe('TodaysCollectionComponent', () => {
  let component: TodaysCollectionComponent;
  let fixture: ComponentFixture<TodaysCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodaysCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
