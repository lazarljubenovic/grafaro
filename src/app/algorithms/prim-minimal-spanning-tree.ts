import {AlgorithmBase, AlgorithmState} from './algorithm-base';
import {Graph} from '../models/graph.model';
import {Min} from '../data-structures/util';
import {
    TrackedVar,
    Color,
    EdgeWeightAnnotationFunction,
    NodeWeightAnnotationFunction,
    Annotations
} from './decorators';
import {getLabelIfDefined} from './utils';
import {GrfColor} from '../graph/graph.module';

@Annotations({
    nodes: [
        {
            position: {r: 20, phi: -90},
            style: '#222',
            font: '10pt Roboto',
            ruleFunction: NodeWeightAnnotationFunction,
        },
        {
            position: {r: 18, phi: 0},
            style: '#70326a',
            font: '9pt Roboto',
            ruleFunction: (state: State, nodeLabel: string) => {
                if (!state.C) {
                    return '';
                }
                const pair: string[] = state.C
                    .find(nodeNumber => nodeNumber[0] == nodeLabel);
                if (pair == null) {
                    return '';
                }
                const n = pair[1];
                return n === 'Infinity' ? '∞' : n;
            }
        }
    ],
    edges: [
        {
            side: 'from',
            style: '#777',
            font: 'italic 10pt Roboto',
            ruleFunction: EdgeWeightAnnotationFunction,
        },
    ],
})
@Color({
    nodes: [
        (state: State, nodeLabel: string) =>
            state.v == nodeLabel ? GrfColor.ACCENT : null,
        (state: State, nodeLabel: string) => {
            if (state.Q) {
                return state.Q.indexOf(nodeLabel) == -1 ? GrfColor.DIMMED : null;
            } else {
                return null;
            }
        }
    ],
    edges: [
        (state: State, edgeLabel: string) => {
            if (state.E) {
                return state.E
                    .map(kv => kv[1])
                    .filter(label => label != null)
                    .indexOf(edgeLabel) > -1 ? GrfColor.PRIMARY : null;
            } else {
                return null;
            }
        }
    ],
})
export class State extends AlgorithmState {
    @TrackedVar('node') public root: string;
    @TrackedVar('node-number') public C: string[][];
    @TrackedVar('node-edge') public E: string[][];
    @TrackedVar('node-edge') public F: string[][];
    @TrackedVar('node') public Q: string[];
    @TrackedVar('node') public v: string;
    @TrackedVar('node') public w: string;
    @TrackedVar('edge') public edge: string;

    constructor(o: CreateNewStateObject) {
        super(o.graph, o.lineNumber);
        this.Q = getLabelIfDefined(o.graph, o.Q ? Array.from(o.Q) : undefined);
        this.root = getLabelIfDefined(o.graph, o.root);
        this.v = getLabelIfDefined(o.graph, o.v);
        this.w = getLabelIfDefined(o.graph, o.w);
        this.edge = o.edge ? o.graph.getEdgeLabel(o.edge) : <any>o.edge;

        if (o.C) {
            this.C = Array.from(o.C)
                .map(kv => [
                    o.graph.getNodeLabel(kv[0]),
                    kv[1].toString(),
                ]);
        } else {
            this.C = undefined;
        }

        if (o.E) {
            this.E = Array.from(o.E)
                .map(kv => [
                    o.graph.getNodeLabel(kv[0]),
                    kv[1] == null ? null : o.graph.getEdgeLabel(kv[1]),
                ]);
        } else {
            this.E = undefined;
        }

        if (o.F) {
            this.F = Array.from(o.F)
                .map(kv => [
                    o.graph.getNodeLabel(kv[0]),
                    kv[1] == null ? null : o.graph.getEdgeLabel(kv[1]),
                ]);
        } else {
            this.F = undefined;
        }
    }
}

interface CreateNewStateObject {
    graph: Graph;
    lineNumber: number;
    root?: string;
    C?: Map<string, number>;
    E?: Map<string, string>;
    F?: Map<string, string>;
    Q?: Set<string>;
    v?: string;
    w?: string;
    edge?: string;
}


export class PrimMinimalSpanningTreeAlgorithm extends AlgorithmBase {
    name: string = `Prim's minimal spanning tree`;
    abbr: string = 'pmst';
    code: string = `function PrimsAlgorithm(graph, root) {
  let C = new Map();
  let E = new Map();
  graph.nodes.forEach(node => {
    C.set(node, Infinity);
    E.set(node, null);
  });
  let F = new Map();
  let Q = new Set(graph.nodes);
  
  while (Q.size > 0) {
    let v = minDistInC();
    Q.delete(v);    
    F.set(v, null);
    if (E.get(v) != null) {
      F.set(v, E.get(v));
    }    
    graph.getEdgesFrom(v).forEach(edge => {
      const w = edge.to;
      if (Q.has(w) && edge.weight < C.get(w)) {
        C.set(w, edge.weight);
        E.set(w, edge.label);
      }
    });
  }
  return F;
}`;

    trackedVariables: string[] = [
        'C', 'E', 'F', 'Q', 'root', 'v', 'w', 'edge'
    ];

    evaluateStatesFor(graph: Graph, root: string): AlgorithmState[] {
        let states: State[] = [];
        states.push(new State({graph, lineNumber: 1}));

        let C = new Map<string, number>();
        let E = new Map<string, string>();

        const orderedNodeIds = [root, ...graph.nodes.map(node => node.id).filter(id => id != root)];

        orderedNodeIds.forEach(id => {
            C.set(id, Infinity);
            E.set(id, null);
        });

        states.push(new State({graph, lineNumber: 8, root, C, E}));

        let F = new Map<string, string>();
        let Q = new Set(orderedNodeIds);

        states.push(new State({graph, lineNumber: 11, root, C, E, F, Q}));

        while (Q.size > 0) {
            states.push(new State({graph, lineNumber: 12, root, C, E, F, Q}));

            const distance = Array.from(C).filter(kv => Q.has(kv[0]));
            const v = Min(new Map(distance), (a, b) => a[1] > b[1] ? 1 : -1)[0];
            states.push(new State({graph, lineNumber: 13, root, C, E, F, Q, v}));

            Q.delete(v);
            states.push(new State({graph, lineNumber: 14, root, C, E, F, Q, v}));

            F.set(v, null);
            states.push(new State({graph, lineNumber: 15, root, C, E, F, Q, v}));

            if (E.get(v) != null) {
                states.push(new State({graph, lineNumber: 16, root, C, E, F, Q, v}));

                F.set(v, E.get(v));
            }
            states.push(new State({graph, lineNumber: 18, root, C, E, F, Q, v}));

            graph.getSources(v).forEach(edge => {
                states.push(new State({graph, lineNumber: 19, root, C, E, F, Q, v, edge: edge.id}));

                const w = edge.to;
                states.push(new State({
                    graph,
                    lineNumber: 20,
                    root,
                    C,
                    E,
                    F,
                    Q,
                    v,
                    w,
                    edge: edge.id
                }));

                if (Q.has(w) && edge.weight < C.get(w)) {
                    states.push(new State({
                        graph,
                        lineNumber: 21,
                        root,
                        C,
                        E,
                        F,
                        Q,
                        v,
                        w,
                        edge: edge.id
                    }));

                    C.set(w, edge.weight);
                    states.push(new State({
                        graph,
                        lineNumber: 22,
                        root,
                        C,
                        E,
                        F,
                        Q,
                        v,
                        w,
                        edge: edge.id
                    }));

                    E.set(w, edge.id);
                }
                states.push(new State({
                    graph,
                    lineNumber: 18,
                    root,
                    C,
                    E,
                    F,
                    Q,
                    v,
                    w,
                    edge: edge.id
                }));
            });
            states.push(new State({graph, lineNumber: 11, root, C, E, F, Q, v}));
        }
        states.push(new State({graph, lineNumber: 26, root, C, E, F, Q}));
        this.states = states;
        return states;
    }
}
