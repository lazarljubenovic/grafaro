/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeaveStorageService } from './leave-storage.service';

xdescribe('LeaveStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveStorageService]
    });
  });

  it('should ...', inject([LeaveStorageService], (service: LeaveStorageService) => {
    expect(service).toBeTruthy();
  }));
});
