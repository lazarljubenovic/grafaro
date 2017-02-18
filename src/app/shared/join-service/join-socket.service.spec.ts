/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {JoinSocketService} from './join-socket.service';

xdescribe('Service: Join', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JoinSocketService]
        });
    });

    it('should ...', inject([JoinSocketService], (service: JoinSocketService) => {
        expect(service).toBeTruthy();
    }));
});
