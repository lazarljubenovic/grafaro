/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {GeometryService} from "./geometry.service";

describe('Service: Geometry', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GeometryService]
        });
    });

    it('should ...', inject([GeometryService], (service: GeometryService) => {
        expect(service).toBeTruthy();
    }));
});
