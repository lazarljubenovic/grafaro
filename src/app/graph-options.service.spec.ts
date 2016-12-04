/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {GraphOptionsService} from './graph-options.service';

describe('Service: GraphOptions', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphOptionsService]
        });
    });

    it('should ...', inject([GraphOptionsService], (service: GraphOptionsService) => {
        expect(service).toBeTruthy();
    }));
});
