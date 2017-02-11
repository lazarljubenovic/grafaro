import {Pipe, PipeTransform} from '@angular/core';
import {GrfColor} from '../graph/graph.module';

@Pipe({
    name: 'colorEnum'
})
export class ColorEnumPipe implements PipeTransform {

    transform(value: GrfColor): string {
        if (value == null) {
            return '';
        } else {
            switch (value) {
                case GrfColor.ACCENT:
                    return 'accent';
                case GrfColor.DIMMED:
                    return 'foreground';
                case GrfColor.DEFAULT:
                    return 'default';
                case GrfColor.PRIMARY:
                    return 'primary';
                case GrfColor.SECONDARY:
                    return 'secondary';
                default:
                    throw 'Unknown color enum value';
            }
        }
    }

}
