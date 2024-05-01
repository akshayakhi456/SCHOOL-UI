import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryFeedbackComponent } from './enquiry-feedback.component';

describe('EnquiryFeedbackComponent', () => {
  let component: EnquiryFeedbackComponent;
  let fixture: ComponentFixture<EnquiryFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnquiryFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
