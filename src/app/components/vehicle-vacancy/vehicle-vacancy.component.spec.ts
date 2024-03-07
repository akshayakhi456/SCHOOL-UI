import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleVacancyComponent } from './vehicle-vacancy.component';

describe('VehicleVacancyComponent', () => {
  let component: VehicleVacancyComponent;
  let fixture: ComponentFixture<VehicleVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleVacancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
