import { TestBed } from '@angular/core/testing';

import { PasswordService } from './password.service';

describe('UserService', () => {
  let service: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
