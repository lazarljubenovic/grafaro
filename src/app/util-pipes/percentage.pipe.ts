import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

    transform(value: number, totalValue: number): string {
        if (value == null || totalValue == null) {
            return '0%';
        }

        if (totalValue == 0) {
            return '0%';
        }

        let result: string = ((value / totalValue) * 100).toFixed(1);

        while (result.endsWith('0')) {
            result = result.slice(0, -1);
        }

        if (result.endsWith('.')) {
            result = result.slice(0, -1);
        }

        return result + '%';
    }

}
