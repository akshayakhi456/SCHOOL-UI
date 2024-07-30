import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallTicketsComponent } from './hall-tickets.component';

describe('HallTicketsComponent', () => {
  let component: HallTicketsComponent;
  let fixture: ComponentFixture<HallTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HallTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
