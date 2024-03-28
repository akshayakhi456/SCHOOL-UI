import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryFormQuestionsComponent } from './enquiry-form-questions.component';

describe('EnquiryFormQuestionsComponent', () => {
  let component: EnquiryFormQuestionsComponent;
  let fixture: ComponentFixture<EnquiryFormQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryFormQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnquiryFormQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
