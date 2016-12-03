/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ElementPositionService } from './element-position.service';

describe('Service: ElementPosition', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElementPositionService]
    });
  });

  it('should ...', inject([ElementPositionService], (service: ElementPositionService) => {
    expect(service).toBeTruthy();
  }));
});
