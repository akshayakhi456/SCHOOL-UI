import { TestBed } from '@angular/core/testing';

import { AlertmessageService } from './alertmessage.service';

describe('AlertmessageService', () => {
  let service: AlertmessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertmessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
