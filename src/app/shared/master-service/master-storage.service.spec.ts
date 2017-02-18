/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MasterStorageService } from './master-storage.service';

xdescribe('MasterStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterStorageService]
    });
  });

  it('should ...', inject([MasterStorageService], (service: MasterStorageService) => {
    expect(service).toBeTruthy();
  }));
});
