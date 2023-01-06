import { TestBed } from '@angular/core/testing';

import { AuthorizedService } from './authorized.service';

describe('AuthorizedService', () => {
  let service: AuthorizedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
