/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {MockJoinSocketService} from './mock-join-socket.service';

xdescribe('MockJoinSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockJoinSocketService]
        });
    });

    it('should ...', inject([MockJoinSocketService], (service: MockJoinSocketService) => {
        expect(service).toBeTruthy();
    }));
});
