/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StateStorageService } from './state-storage.service';

xdescribe('StateStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateStorageService]
    });
  });

  it('should ...', inject([StateStorageService], (service: StateStorageService) => {
    expect(service).toBeTruthy();
  }));
});
