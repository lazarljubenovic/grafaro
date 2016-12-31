import {Pipe, PipeTransform} from '@angular/core';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphEdgeOptions} from './graph.module';

@Pipe({
    name: 'graphEdgeOptionsTransform',
})
export class GraphEdgeOptionsTransformPipe implements PipeTransform {

    transform(value: GrfGraphEdgeOptions): VisNgNetworkOptionsEdges {
        return {
            id: value.id,
            from: value.from,
            to: value.to,
            label: value.label,
            arrows: 'to',
        };
    }

}
