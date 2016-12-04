/* tslint:disable:no-unused-variable */
import {ContainsPipe} from './contains.pipe';

describe('Pipe: Contains', () => {
    const transform = new ContainsPipe().transform;

    it(`should return false for null array`, () => {
        expect(transform(null, 1)).toBe(false);
    });

    it(`should return false when element is not in array`, () => {
        expect(transform([1, 2, 3], 4)).toBe(false);
    });

    it(`should return true when element is in the array`, () => {
        expect(transform([1, 2, 3], 1)).toBe(true);
    });
});
