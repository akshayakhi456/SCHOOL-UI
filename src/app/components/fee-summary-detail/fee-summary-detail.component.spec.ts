import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeSummaryDetailComponent } from './fee-summary-detail.component';

describe('FeeSummaryDetailComponent', () => {
  let component: FeeSummaryDetailComponent;
  let fixture: ComponentFixture<FeeSummaryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeSummaryDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeeSummaryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
