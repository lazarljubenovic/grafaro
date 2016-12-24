/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {ProjectsService} from './projects.service';

xdescribe('Service: Projects', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProjectsService]
        });
    });

    it('should ...', inject([ProjectsService], (service: ProjectsService) => {
        expect(service).toBeTruthy();
    }));
});
