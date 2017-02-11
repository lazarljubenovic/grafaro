/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {AlgorithmSocketService} from './algorithm-socket.service';

xdescribe('AlgorithmSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AlgorithmSocketService]
        });
    });

    it('should ...', inject([AlgorithmSocketService], (service: AlgorithmSocketService) => {
        expect(service).toBeTruthy();
    }));
});
