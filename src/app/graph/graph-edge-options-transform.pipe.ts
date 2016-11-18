import {Pipe, PipeTransform} from '@angular/core';
import {VisNgOptionsEdges} from "@lazarljubenovic/vis-ng/esm/core/vis-graph/options.interface";
import {GrfGraphEdgeOptions} from "./graph.module";

@Pipe({
    name: 'graphEdgeOptionsTransform',
})
export class GraphEdgeOptionsTransformPipe implements PipeTransform {

    transform(value: GrfGraphEdgeOptions): VisNgOptionsEdges {
        return value;
    }

}
