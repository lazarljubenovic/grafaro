/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnnotationService } from './annotation.service';

describe('Service: Annotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnotationService]
    });
  });

  it('should ...', inject([AnnotationService], (service: AnnotationService) => {
    expect(service).toBeTruthy();
  }));
});
