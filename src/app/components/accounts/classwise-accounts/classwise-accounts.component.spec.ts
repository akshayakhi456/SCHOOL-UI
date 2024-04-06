import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseAccountsComponent } from './classwise-accounts.component';

describe('ClasswiseAccountsComponent', () => {
  let component: ClasswiseAccountsComponent;
  let fixture: ComponentFixture<ClasswiseAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasswiseAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClasswiseAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
