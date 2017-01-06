/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {JoinService} from './join.service';

xdescribe('Service: Join', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JoinService]
        });
    });

    it('should ...', inject([JoinService], (service: JoinService) => {
        expect(service).toBeTruthy();
    }));
});
