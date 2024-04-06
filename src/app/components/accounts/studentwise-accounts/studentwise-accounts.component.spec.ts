import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentwiseAccountsComponent } from './studentwise-accounts.component';

describe('StudentwiseAccountsComponent', () => {
  let component: StudentwiseAccountsComponent;
  let fixture: ComponentFixture<StudentwiseAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentwiseAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentwiseAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
