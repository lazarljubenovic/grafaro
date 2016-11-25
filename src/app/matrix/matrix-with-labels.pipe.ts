import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'matrixWithLabels'
})
export class MatrixWithLabelsPipe implements PipeTransform {

    transform(data: any[][],
              rowLabels: string[],
              colLabels: string[]): any[][] {
        return [
            [null, ...colLabels],
            ...data.map((row, i) => [rowLabels[i], ...row]),
        ];
    }

}
