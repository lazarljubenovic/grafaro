import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'contains'
})
export class ContainsPipe implements PipeTransform {

    transform(array: any[], element: any): any {
        if (array == null) {
            return false;
        } else {
            return array.indexOf(element) !== -1;
        }
    }

}
