/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {Auth0Service} from './auth0.service';

xdescribe('Service: Auth0', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Auth0Service]
        });
    });

    it('should ...', inject([Auth0Service], (service: Auth0Service) => {
        expect(service).toBeTruthy();
    }));
});
