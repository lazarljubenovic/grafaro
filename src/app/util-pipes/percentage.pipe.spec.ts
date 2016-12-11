/* tslint:disable:no-unused-variable */
import {PercentagePipe} from './percentage.pipe';

describe(`Pipe: Percentage`, () => {

    it(`should create an instance`, () => {
        const pipe = new PercentagePipe();
        expect(pipe).toBeTruthy();
    });

    it(`should calculate percentage and drop last zeroes`, () => {
        const pipe = new PercentagePipe();
        expect(pipe.transform(1, 2)).toBe('50%');
    });

    it(`should calculate percentage for fraction result`, () => {
        const pipe = new PercentagePipe();
        expect(pipe.transform(2, 3)).toBe('66.7%');
    });

    it(`should not die if total is zero`, () => {
        const pipe = new PercentagePipe();
        expect(pipe.transform(1, 0)).toBe('0%');
    });

    it(`should not die if both are zero`, () => {
        const pipe = new PercentagePipe();
        expect(pipe.transform(0, 0)).toBe('0%');
    });

    it(`should not die if some are null/undefined`, () => {
        const pipe = new PercentagePipe();
        expect(pipe.transform(null, null)).toBe('0%');
    });

});
