/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BreadthFirstSearchService } from './breadth-first-search.service';

describe('Service: BreadthFirstSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreadthFirstSearchService]
    });
  });

  it('should ...', inject([BreadthFirstSearchService], (service: BreadthFirstSearchService) => {
    expect(service).toBeTruthy();
  }));
});
