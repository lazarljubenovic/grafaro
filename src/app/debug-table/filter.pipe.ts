import {Pipe, PipeTransform} from '@angular/core';
import {DebugData} from '../algorithms/algorithm-base';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {

    transform(debugData: DebugData[], names: string[]): DebugData[] {
        console.log('pipe', debugData, names);
        if (debugData == null) {
            return [];
        }
        return debugData.filter(data => names.indexOf(data.name) != -1);
    }

}
