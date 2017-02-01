/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {DebugTableService} from './debug-table.service';

xdescribe('Service: DebugTable', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DebugTableService]
        });
    });

    it('should ...', inject([DebugTableService], (service: DebugTableService) => {
        expect(service).toBeTruthy();
    }));
});
