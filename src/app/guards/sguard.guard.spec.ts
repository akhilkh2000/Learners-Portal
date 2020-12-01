import { TestBed } from '@angular/core/testing';

import { SguardGuard } from './sguard.guard';

describe('SguardGuard', () => {
  let guard: SguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
