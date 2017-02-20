/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {MockAlgorithmSocketService} from './mock-algorithm-socket.service';

xdescribe('MockAlgorithmSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockAlgorithmSocketService]
        });
    });

    it('should ...', inject([MockAlgorithmSocketService], (service: MockAlgorithmSocketService) => {
        expect(service).toBeTruthy();
    }));
});
