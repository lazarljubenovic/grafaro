/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TabsService } from './tabs.service';

describe('Service: Tabs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabsService]
    });
  });

  it('should ...', inject([TabsService], (service: TabsService) => {
    expect(service).toBeTruthy();
  }));
});
