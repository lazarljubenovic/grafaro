/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {StateSocketService} from './state-socket.service';

xdescribe('StateSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StateSocketService]
        });
    });

    it('should ...', inject([StateSocketService], (service: StateSocketService) => {
        expect(service).toBeTruthy();
    }));
});
