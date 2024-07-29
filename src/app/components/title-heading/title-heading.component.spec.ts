import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleHeadingComponent } from './title-heading.component';

describe('TitleHeadingComponent', () => {
  let component: TitleHeadingComponent;
  let fixture: ComponentFixture<TitleHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleHeadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitleHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
