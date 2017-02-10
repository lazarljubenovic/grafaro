import {Pipe, PipeTransform} from '@angular/core';
import {DebugData} from '../algorithms/debug-data.interface';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {

    transform(debugData: DebugData[], names: string[]): DebugData[] {
        if (debugData == null) {
            return [];
        }
        return debugData.filter(data => names.indexOf(data.name) != -1);
    }

}
