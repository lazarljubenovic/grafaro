/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {MasterSocketService} from './master-socket.service';

xdescribe('MasterSocketService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MasterSocketService]
        });
    });

    it('should ...', inject([MasterSocketService], (service: MasterSocketService) => {
        expect(service).toBeTruthy();
    }));
});
