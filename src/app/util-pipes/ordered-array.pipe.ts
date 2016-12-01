import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'orderedArray'
})
export class OrderedArrayPipe implements PipeTransform {

    transform(length: number): number[] {
        return Array(length).fill(0).map((_, i) => i);
    }

}
