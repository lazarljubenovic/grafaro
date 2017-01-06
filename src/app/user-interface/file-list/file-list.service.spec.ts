/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {FileListService} from './file-list.service';

describe('Service: FileList', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FileListService]
        });
    });

    it('should ...', inject([FileListService], (service: FileListService) => {
        expect(service).toBeTruthy();
    }));
});
