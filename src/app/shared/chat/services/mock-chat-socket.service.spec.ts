/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockChatSocketService } from './mock-chat-socket.service';

xdescribe('MockChatSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockChatSocketService]
    });
  });

  it('should ...', inject([MockChatSocketService], (service: MockChatSocketService) => {
    expect(service).toBeTruthy();
  }));
});
