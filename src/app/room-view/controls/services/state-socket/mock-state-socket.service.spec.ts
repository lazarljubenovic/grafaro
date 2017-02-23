/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockStateSocketService } from './mock-state-socket.service';

xdescribe('MockStateSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockStateSocketService]
    });
  });

  it('should ...', inject([MockStateSocketService], (service: MockStateSocketService) => {
    expect(service).toBeTruthy();
  }));
});
