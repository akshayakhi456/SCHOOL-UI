import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeSummaryComponent } from './fee-summary.component';

describe('FeeSummaryComponent', () => {
  let component: FeeSummaryComponent;
  let fixture: ComponentFixture<FeeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
