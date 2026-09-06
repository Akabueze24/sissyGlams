import { TestBed } from '@angular/core/testing';

import { AgeGateService } from './age-gate.service';

describe('AgeGateService', () => {
  let service: AgeGateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgeGateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
