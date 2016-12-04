/* tslint:disable:no-unused-variable */
import {MatrixWithLabelsPipe} from './matrix-with-labels.pipe';

describe('Pipe: MatrixWithLabels', () => {
    const pipe = new MatrixWithLabelsPipe();
    const transform = pipe.transform;

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it(`should label correctly`, () => {
        const data = [
            [10, 11, 12],
            [20, 21, 22],
            [30, 31, 32],
            [40, 41, 42],
        ];
        const rowLabels = ['a', 'b', 'c', 'd'];
        const colLabels = ['A', 'B', 'C'];

        const labeled = [
            [null, 'A', 'B', 'C'],
            ['a', 10, 11, 12],
            ['b', 20, 21, 22],
            ['c', 30, 31, 32],
            ['d', 40, 41, 42],
        ];

        expect(transform(data, rowLabels, colLabels)).toEqual(labeled);
    });
});
