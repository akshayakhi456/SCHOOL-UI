import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardTemplateComponent } from './report-card-template.component';

describe('ReportCardTemplateComponent', () => {
  let component: ReportCardTemplateComponent;
  let fixture: ComponentFixture<ReportCardTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCardTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportCardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
