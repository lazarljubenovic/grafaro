import {Pipe, PipeTransform} from '@angular/core';
// todo check if it is used
@Pipe({
    name: 'object'
})
export class ObjectPipe implements PipeTransform {

    transform(object: {[key: string]: any}): {key: string, value: any}[] {
        if (object == null) {
            return [];
        }
        return Object.keys(object).map((key: string) => ({
            key,
            value: object[key],
        }));
    }

}
