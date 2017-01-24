/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DebugTableService } from './debug-table.service';

describe('Service: DebugTable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebugTableService]
    });
  });

  it('should ...', inject([DebugTableService], (service: DebugTableService) => {
    expect(service).toBeTruthy();
  }));
});
