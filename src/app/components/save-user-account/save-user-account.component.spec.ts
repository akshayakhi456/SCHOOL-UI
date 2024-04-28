import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUserAccountComponent } from './save-user-account.component';

describe('SaveUserAccountComponent', () => {
  let component: SaveUserAccountComponent;
  let fixture: ComponentFixture<SaveUserAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveUserAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveUserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
