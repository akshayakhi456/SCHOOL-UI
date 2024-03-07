import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysCollectionReportComponent } from './todays-collection-report.component';

describe('TodaysCollectionReportComponent', () => {
  let component: TodaysCollectionReportComponent;
  let fixture: ComponentFixture<TodaysCollectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysCollectionReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodaysCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
