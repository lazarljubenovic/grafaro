import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'object'
})
export class ObjectPipe implements PipeTransform {

    transform(object: {}): {key: string, value: any}[] {
        if (object == null) {
            return [];
        }
        return Object.keys(object).map(key => ({
            key,
            value: object[key],
        }));
    }

}
