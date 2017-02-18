/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {JoinStorageService} from './join-storage.service';

xdescribe('JoinStorageService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JoinStorageService]
        });
    });

    it('should ...', inject([JoinStorageService], (service: JoinStorageService) => {
        expect(service).toBeTruthy();
    }));
});
