/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoomEditService } from './room-edit.service';

xdescribe('Service: RoomEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomEditService]
    });
  });

  it('should ...', inject([RoomEditService], (service: RoomEditService) => {
    expect(service).toBeTruthy();
  }));
});
