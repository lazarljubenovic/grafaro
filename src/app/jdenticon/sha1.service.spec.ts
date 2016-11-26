/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {Sha1Service} from "./sha1.service";

// TODO why like this?
xdescribe('Service: Sha1', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Sha1Service]
        });
    });

    it('should ...', inject([Sha1Service], (service: Sha1Service) => {
        expect(service).toBeTruthy();
    }));
});

describe(`Service: Sha1`, () => {
    const service = new Sha1Service();

    describe(`convert`, () => {
        it(`should encode empty string`, () => {
            expect(service.convert(``)).toBe(`da39a3ee5e6b4b0d3255bfef95601890afd80709`);
        });

        it(`should encode a string`, () => {
            expect(service.convert(`The quick brown fox jumps over the lazy dog`))
                .toBe(`2fd4e1c67a2d28fced849ee1bb76e7391b93eb12`);
        });
    });

});
