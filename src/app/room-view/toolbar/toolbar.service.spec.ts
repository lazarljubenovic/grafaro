/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {ToolbarService} from './toolbar.service';

xdescribe('ToolbarService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToolbarService]
        });
    });

    it('should ...', inject([ToolbarService], (service: ToolbarService) => {
        expect(service).toBeTruthy();
    }));
});
