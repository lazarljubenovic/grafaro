/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {RoomInfoSocketService} from './room-info.service';

xdescribe('Service: RoomInfo', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RoomInfoSocketService]
        });
    });

    it('should ...', inject([RoomInfoSocketService], (service: RoomInfoSocketService) => {
        expect(service).toBeTruthy();
    }));
});
