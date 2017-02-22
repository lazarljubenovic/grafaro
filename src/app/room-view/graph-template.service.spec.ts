/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {GraphTemplateService} from './graph-template.service';

xdescribe('GraphTemplateService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GraphTemplateService]
        });
    });

    it('should ...', inject([GraphTemplateService], (service: GraphTemplateService) => {
        expect(service).toBeTruthy();
    }));
});
