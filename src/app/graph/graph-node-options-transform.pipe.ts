import {Pipe, PipeTransform} from '@angular/core';
import {GrfGraphNodeOptions} from './graph.module';
import {ColorThemeService} from '../color-theme.service';
import {VisNgNetworkOptionsNodes} from '@lazarljubenovic/vis-ng/core';

@Pipe({
    name: 'graphNodeOptionsTransform',
})
export class GraphNodeOptionsTransformPipe implements PipeTransform {

    constructor(private theme: ColorThemeService) {
    }

    transform(options: GrfGraphNodeOptions): VisNgNetworkOptionsNodes {

        const color = this.theme.palette[options.color];

        const shape = 'circle';

        const x = options.position.x;
        const y = options.position.y;

        return Object.assign({
            id: options.id,
            label: options.label,
            color,
            shape,
            x,
            y,
        });
    }

}
