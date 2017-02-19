/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockGraphSocketService } from './mock-graph-socket.service';

xdescribe('MockGraphSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockGraphSocketService]
    });
  });

  it('should ...', inject([MockGraphSocketService], (service: MockGraphSocketService) => {
    expect(service).toBeTruthy();
  }));
});
