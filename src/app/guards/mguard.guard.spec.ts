import { TestBed } from '@angular/core/testing';

import { MguardGuard } from './mguard.guard';

describe('MguardGuard', () => {
  let guard: MguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
