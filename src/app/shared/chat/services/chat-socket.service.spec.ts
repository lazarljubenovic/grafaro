/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {ChatSocketService} from './chat-socket.service';

// TODO
xdescribe('Service: ChatSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ChatSocketService]
        });
    });

    it('should ...', inject([ChatSocketService], (service: ChatSocketService) => {
        expect(service).toBeTruthy();
    }));
});
