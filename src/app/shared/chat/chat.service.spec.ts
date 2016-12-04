/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {ChatService} from './chat.service';

// TODO
xdescribe('Service: ChatService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ChatService]
        });
    });

    it('should ...', inject([ChatService], (service: ChatService) => {
        expect(service).toBeTruthy();
    }));
});
