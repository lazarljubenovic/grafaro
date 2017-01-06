/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {AlgorithmService} from './algorithm.service';

// TODO
xdescribe('Service: BreadthFirstSearch', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AlgorithmService]
        });
    });

    it('should ...', inject([AlgorithmService], (service: AlgorithmService) => {
        expect(service).toBeTruthy();
    }));
});
