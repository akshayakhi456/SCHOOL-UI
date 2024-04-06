import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallAccountsComponent } from './overall-accounts.component';

describe('OverallAccountsComponent', () => {
  let component: OverallAccountsComponent;
  let fixture: ComponentFixture<OverallAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverallAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
