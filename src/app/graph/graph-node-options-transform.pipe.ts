import {Pipe, PipeTransform} from '@angular/core';
import {VisNgOptionsNodes} from '@lazarljubenovic/vis-ng/core/vis-graph/options.interface';
import {GrfGraphNodeOptions} from "./graph.module";

@Pipe({
    name: 'graphNodeOptionsTransform',
})
export class GraphNodeOptionsTransformPipe implements PipeTransform {

    transform(options: GrfGraphNodeOptions): any {
        const backgroundColor: string = options.state === 'current' ? 'red' : options.state === 'visited' ? 'grey' : 'white';
        const shape: 'circle' | 'triangle' | 'square' = options.isStart ? 'triangle' : options.isEnd ? 'square' : 'circle';

        return {
            id: options.label,
            label: options.label,
            color: {
                background: backgroundColor,
            },
            shape: shape,
        };
    }

}
