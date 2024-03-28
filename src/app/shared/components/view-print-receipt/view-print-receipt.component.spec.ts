import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrintReceiptComponent } from './view-print-receipt.component';

describe('ViewPrintReceiptComponent', () => {
  let component: ViewPrintReceiptComponent;
  let fixture: ComponentFixture<ViewPrintReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPrintReceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPrintReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
