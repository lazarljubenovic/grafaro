import {Injectable} from '@angular/core';
import {Graph, GraphJson} from './models/graph.model';


@Injectable()
export class GraphJsonService {

    public writeJson(graph: Graph): GraphJson {
        return graph.writeJson();
    }

    public readJson(graphJson: GraphJson): Graph {
        const graph = new Graph();
        return graph.readJson(graphJson);
    }

    constructor() {
    }

}
