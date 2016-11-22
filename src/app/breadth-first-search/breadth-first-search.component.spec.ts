/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BreadthFirstSearchComponent } from './breadth-first-search.component';
import {BreadthFirstSearchService} from "./breadth-first-search.service";

describe('Component: BreadthFirstSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreadthFirstSearchService]
    })
  });

  it('should create an instance', () => {
    let component = new BreadthFirstSearchComponent(new BreadthFirstSearchService);
    expect(component).toBeTruthy();
  });
});
