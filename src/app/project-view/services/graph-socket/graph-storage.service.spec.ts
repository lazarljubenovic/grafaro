/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GraphStorageService } from './graph-storage.service';

xdescribe('GraphStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphStorageService]
    });
  });

  it('should ...', inject([GraphStorageService], (service: GraphStorageService) => {
    expect(service).toBeTruthy();
  }));
});
