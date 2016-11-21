/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmojiService } from './emoji.service';

describe('Service: Emoji', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmojiService]
    });
  });

  it('should ...', inject([EmojiService], (service: EmojiService) => {
    expect(service).toBeTruthy();
  }));
});
