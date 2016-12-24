/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {GrafaroHttpService} from './grafaro-http.service';

xdescribe('Service: GrafaroHttp', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GrafaroHttpService]
        });
    });

    it('should ...', inject([GrafaroHttpService], (service: GrafaroHttpService) => {
        expect(service).toBeTruthy();
    }));
});
