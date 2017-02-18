/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatStorageService } from './chat-storage.service';

xdescribe('ChatStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatStorageService]
    });
  });

  it('should ...', inject([ChatStorageService], (service: ChatStorageService) => {
    expect(service).toBeTruthy();
  }));
});
