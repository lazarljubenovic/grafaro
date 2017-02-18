/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockMasterSocketService } from './mock-master-socket.service';

xdescribe('MockMasterSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockMasterSocketService]
    });
  });

  it('should ...', inject([MockMasterSocketService], (service: MockMasterSocketService) => {
    expect(service).toBeTruthy();
  }));
});
