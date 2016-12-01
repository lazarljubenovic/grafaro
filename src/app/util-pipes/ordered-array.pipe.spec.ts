/* tslint:disable:no-unused-variable */
import {OrderedArrayPipe} from "./ordered-array.pipe";

describe('Pipe: OrderedArray', () => {
    const pipe = new OrderedArrayPipe();

    it(`should return ordered array`, () => {
        expect(pipe.transform(3)).toEqual([0, 1, 2]);
    });
});
