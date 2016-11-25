/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ColorThemeService } from './color-theme.service';

describe('Service: ColorTheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorThemeService]
    });
  });

  it('should ...', inject([ColorThemeService], (service: ColorThemeService) => {
    expect(service).toBeTruthy();
  }));
});
