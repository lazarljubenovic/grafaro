/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {GraphSocketService} from './graph-socket.service';

xdescribe('Service: GraphSocket', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphSocketService]
        });
    });

    it('should ...', inject([GraphSocketService], (service: GraphSocketService) => {
        expect(service).toBeTruthy();
    }));
});
