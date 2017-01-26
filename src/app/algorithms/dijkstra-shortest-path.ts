/* tslint:disable */
import {
    AlgorithmBase, AlgorithmState, TrackedVariable, getLabelIfDefined,
    ColorExporter
} from './algorithm-base';
import {NormalizedState} from './algorithm.service';
import {Graph, GraphEdge} from '../models/graph.model';
import {Min} from '../data-structures/util';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';

export class DijkstraShortestPathState extends AlgorithmState {

    @TrackedVariable() @ColorExporter([], () => 'default') public root: string;
    @TrackedVariable() public Q: string[];
    @TrackedVariable() public distance: string[][];
    @TrackedVariable() public previous: string[][];
    @TrackedVariable() public u: string;
    @TrackedVariable() public neighborEdges: string[];
    @TrackedVariable() public edge: string[];
    @TrackedVariable() public alt: number;

}

export class DijkstraShortestPathAlgorithm extends AlgorithmBase {

    public code: string = `function DijkstraShortestPath(graph, root) {
  let Q = new Set();
  let distance = new Map();
  let previous = new Map();
  graph.node.forEach(node => {
    distance.set(node, Infinity);
    previous.set(node, null);
    Q.add(node);
  });
  distance.set(root, 0);
  
  while(!Q.isEmpty()) {
    let u = minInQ(distance).key;
    Q.delete(u);
    
    let neighborEdges = graph.neighbors(u);
    neighborEdges.filter(edge => Q.has(edge.to))
      .forEach(edge => {
        let alt = distance.get(u) + edge.weight;
        if (alt < distance.get(edge.to)) {
          distance.set(edge.to, alt);
          previous.set(edge.to, u);
        }
    });
  }
  
  return [distance, previous];
}`;

    public trackedVariables: string[] = ['Q', 'distance', 'previous', 'u', 'neighborEdges', 'edge', 'alt'];

    public normalize(state: DijkstraShortestPathState): NormalizedState {

        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map((node, i) => {
            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                isStart: state.root == node.id,
                isEnd: false,
                isAccentColor: state.u == node.id,
                isPrimaryColor: false,
                isSecondaryColor: false,
                isDimmedColor: false,
                annotations: [
                    {
                        position: 'ne',
                        text: node.weight.toString(),
                        style: 'black',
                    },
                ],
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;
        const accentColor: string[] = [];
        const primaryColor: string[] = [];
        const secondaryColor: string[] = [];

        return {nodes, edges, accentColor, primaryColor, secondaryColor};
    }

    private cns(graph: Graph,
                lineNumber: number,
                Q: Set<string>,
                distance: Map<string, number>,
                previous: Map<string, string>,
                u: string,
                neighborEdges: GraphEdge[],
                edge: string,
                alt: number,
                root: string): DijkstraShortestPathState {
        let state = new DijkstraShortestPathState(graph, lineNumber);
        state.Q = getLabelIfDefined(graph, Q ? Array.from(Q) : undefined);
        state.distance = getLabelIfDefined(graph, distance ? Array.from(distance) : undefined);
        state.previous = getLabelIfDefined(graph, previous ? Array.from(previous) : undefined);
        state.u = getLabelIfDefined(graph, u);
        state.neighborEdges = neighborEdges ? neighborEdges.map(edge => edge.label) : <any>neighborEdges;
        state.edge = getLabelIfDefined(graph, edge);
        state.alt = alt;
        state.root = getLabelIfDefined(graph, root);
        // console.log('state', state);
        return state;
    }

    public algorithmFunction(graph: Graph, rootId: string): DijkstraShortestPathState[] {
        let states: DijkstraShortestPathState[] = [];

        states.push(this.cns(graph, 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined));
        states.push(this.cns(graph, 2, undefined, undefined, undefined, undefined, undefined, undefined, undefined, rootId));

        let Q = new Set<string>();
        states.push(this.cns(graph, 3, Q, undefined, undefined, undefined, undefined, undefined, undefined, rootId));

        let distance = new Map<string, number>();
        states.push(this.cns(graph, 4, Q, distance, undefined, undefined, undefined, undefined, undefined, rootId));

        let previous = new Map<string, string>();
        states.push(this.cns(graph, 5, Q, distance, previous, undefined, undefined, undefined, undefined, rootId));

        graph.nodes.forEach(node => {
            distance.set(node.id, Infinity);
            previous.set(node.id, null);
            Q.add(node.id);
        });
        states.push(this.cns(graph, 10, Q, distance, previous, undefined, undefined, undefined, undefined, rootId));

        distance.set(rootId, 0);
        states.push(this.cns(graph, 12, Q, distance, previous, undefined, undefined, undefined, undefined, rootId));

        let i = 1000;

        while (Q.size != 0 && i-- > 0) {
            states.push(this.cns(graph, 13, Q, distance, previous, undefined, undefined, undefined, undefined, rootId));

            const distanceArr = Array.from(distance).filter(kv => Q.has(kv[0]));
            let u: string = Min(new Map(distanceArr), (a, b) => a[1] > b[1] ? 1 : -1)[0];
            states.push(this.cns(graph, 14, Q, distance, previous, u, undefined, undefined, undefined, rootId));

            Q.delete(u);
            states.push(this.cns(graph, 16, Q, distance, previous, u, undefined, undefined, undefined, rootId));

            let neighborsEdges: GraphEdge[] = graph.getSources(u);
            states.push(this.cns(graph, 17, Q, distance, previous, u, neighborsEdges, undefined, undefined, rootId));

            neighborsEdges = neighborsEdges.filter(edge => Q.has(edge.to));
            states.push(this.cns(graph, 18, Q, distance, previous, u, neighborsEdges, undefined, undefined, rootId));

            neighborsEdges
                .forEach(edge => {
                    states.push(this.cns(graph, 19, Q, distance, previous, u, neighborsEdges, edge.id, undefined, rootId));

                    let alt = distance.get(u) + edge.weight;
                    states.push(this.cns(graph, 20, Q, distance, previous, u, neighborsEdges, edge.id, undefined, rootId));

                    if (alt < distance.get(edge.to)) {

                        distance.set(edge.to, alt);
                        states.push(this.cns(graph, 21, Q, distance, previous, u, neighborsEdges, edge.id, alt, rootId));

                        previous.set(edge.to, u);
                        states.push(this.cns(graph, 22, Q, distance, previous, u, neighborsEdges, edge.id, undefined, rootId));
                    }
                    states.push(this.cns(graph, 18, Q, distance, previous, u, neighborsEdges, edge.id, undefined, rootId));
                });
            states.push(this.cns(graph, 12, Q, distance, previous, u, neighborsEdges, undefined, undefined, rootId));
        }

        states.push(this.cns(graph, 27, Q, distance, previous, undefined, undefined, undefined, undefined, rootId));

        return states;
    }


}
