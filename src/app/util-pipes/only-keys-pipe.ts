import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'onlyKeys'
})
export class OnlyKeysPipe implements PipeTransform {

    transform(keyValuePairs: {key: string, value: any}[],
              forbiddenKeys: string[]): {key: string, value: any}[] {
        if (forbiddenKeys == null) {
            return keyValuePairs;
        }
        return keyValuePairs.filter(keyValuePair => {
            return forbiddenKeys.indexOf(keyValuePair.key) != -1;
        });
    }

}
