import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveExpensesComponent } from './save-expenses.component';

describe('SaveExpensesComponent', () => {
  let component: SaveExpensesComponent;
  let fixture: ComponentFixture<SaveExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveExpensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
