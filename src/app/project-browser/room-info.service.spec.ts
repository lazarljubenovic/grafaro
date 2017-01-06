/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {RoomInfoService} from './room-info.service';

xdescribe('Service: RoomInfo', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RoomInfoService]
        });
    });

    it('should ...', inject([RoomInfoService], (service: RoomInfoService) => {
        expect(service).toBeTruthy();
    }));
});
