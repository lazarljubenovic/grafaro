import {Pipe, PipeTransform} from '@angular/core';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphEdgeOptions} from './graph.module';

function existsInverseOf(fromNodeId: string,
                         toNodeId: string,
                         edges: GrfGraphEdgeOptions[]): boolean {
    return edges.find(edge => edge.from == toNodeId && edge.to == fromNodeId) != null;
}

@Pipe({name: 'graphEdgeOptionsTransform'})
export class GraphEdgeOptionsTransformPipe implements PipeTransform {

    transform(edge: GrfGraphEdgeOptions,
              allEdges?: GrfGraphEdgeOptions[]): VisNgNetworkOptionsEdges {
        let options: VisNgNetworkOptionsEdges = {
            id: edge.id,
            from: edge.from,
            to: edge.to,
            label: edge.label,
            arrows: 'to',
        };
        if (allEdges != null && existsInverseOf(edge.from, edge.to, allEdges)) {
            options.smooth = {
                enabled: true,
                roundness: .3,
                type: 'curvedCW',
            };
        }
        return options;
    }

}
