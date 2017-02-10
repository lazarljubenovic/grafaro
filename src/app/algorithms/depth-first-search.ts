import {NormalizedState} from './normalized-state.model';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {
    GrfGraphNodeOptions, GrfGraphNodeOptionRole,
    GrfGraphNodeOptionColor
} from '../graph/graph.module';
import {Graph} from '../models/graph.model';
import {Stack} from '../data-structures/stack';
import {
    AlgorithmBase,
    TrackedVariable,
    ColorExporter,
    AlgorithmState,
    getLabelIfDefined,
    KindExporter
} from './algorithm-base';

function colorExporterNeighbors(neighbors: string[], neighbor: string): string[] {
    return neighbors.map(x => x == neighbor ? 'primary' : 'default');
}

class State extends AlgorithmState {

    @TrackedVariable() @KindExporter('node') public currentNode: string;

    @ColorExporter(['neighbor'], colorExporterNeighbors)
    @TrackedVariable() @KindExporter('node') public neighbors: string[];

    @ColorExporter([], () => 'primary')
    @TrackedVariable() @KindExporter('node') public neighbor: string;

    @TrackedVariable() @KindExporter('node') public visited: string[];

    @TrackedVariable() @KindExporter('node') public solution: string[];

    @TrackedVariable() @KindExporter('node') public stack: string[];

    @TrackedVariable() @KindExporter('node') public root: string;

    constructor(o: CreateNewStateObject) {
        super(o.graph, o.lineNumber);
        this.currentNode = getLabelIfDefined(o.graph, o.currentNode);
        this.neighbors = getLabelIfDefined(o.graph, o.neighbors);
        this.neighbor = getLabelIfDefined(o.graph, o.neighbor);
        this.solution = getLabelIfDefined(o.graph, o.solution);
        this.visited = getLabelIfDefined(o.graph, o.visited);
        this.stack = getLabelIfDefined(o.graph, o.stack ? o.stack.toArray() : undefined);
        this.root = getLabelIfDefined(o.graph, o.root);
    }

}

interface CreateNewStateObject {
    currentNode?: string;
    neighbors?: string[];
    solution?: string[];
    graph?: Graph;
    visited?: string[];
    stack?: Stack<string>;
    root?: string;
    lineNumber?: number;
    neighbor?: string;
}

export class DepthFirstSearchAlgorithm extends AlgorithmBase {

    public states: State[];

    public name: string = 'Depth First Search';
    public abbr: string = 'dfs';

    public trackedVariables: string[] = [
        'neighbors', 'visited', 'solution', 'stack', 'root', 'neighbor', 'currentNode'
    ];

    public code: string = `function DepthFirstSearch(graph, root) {
  let solution = [];
  let stack = new Stack();
  stack.push(root);
  let visited = new Set();
  while (!stack.isEmpty()) {
    let currentNode = stack.pop();
    let neighbors = graph.neighbors(currentNode);
    visited.add(currentNode);
    neighbors
      .filter(neighbor => !visited.has(neighbor))
      .filter(neighbor => !stack.has(neighbor))
      .forEach(neighbor => stack.push(neighbor));
    solution.push(currentNode);
  }
  return solution;
}`;

    public normalize(state: State): NormalizedState {
        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map(node => {
            const role = state.root == node.label ? GrfGraphNodeOptionRole.START
                : GrfGraphNodeOptionRole.DEFAULT;

            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                role,
                color: GrfGraphNodeOptionColor.ACCENT,
                annotations: [],
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;

        return {nodes, edges};
    }

    evaluateStatesFor(graph: Graph, root: string): State[] {
        if (!graph.hasNodeId(root)) {
            throw new Error(`Node with id ${root} (root) doesn't exist on graph!`);
        }

        let states: State[] = [];

        states.push(new State({graph, lineNumber: 1}));
        states.push(new State({graph, root, lineNumber: 2}));

        let solution: string[] = [];
        states.push(new State({solution, graph, root, lineNumber: 3}));

        let stack = new Stack<string>();
        states.push(new State({solution, graph, stack, root, lineNumber: 4}));

        stack.push(root);
        states.push(new State({solution, graph, stack, root, lineNumber: 5}));

        let visited: string[] = [];
        states.push(new State({solution, graph, visited, stack, root, lineNumber: 6}));

        while (!stack.isEmpty) {
            states.push(new State({solution, graph, visited, stack, root, lineNumber: 7}));

            let currentNode: string = stack.pop();
            states.push(new State({
                currentNode,
                solution,
                graph,
                visited,
                stack,
                root,
                lineNumber: 8
            }));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(new State({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                stack,
                root,
                lineNumber: 9
            }));

            visited.push(currentNode);
            states.push(new State({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                stack,
                root,
                lineNumber: 11
            }));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(new State({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                stack,
                root,
                lineNumber: 12
            }));

            neighbors = neighbors.filter(neighbor => !stack.contains(neighbor));
            states.push(new State({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                stack,
                root,
                lineNumber: 13
            }));

            neighbors.forEach((neighbor, i) => {
                stack.push(neighbor);
                states.push(new State({
                    currentNode,
                    neighbors,
                    solution,
                    graph,
                    visited,
                    stack,
                    root,
                    lineNumber: 13,
                    neighbor
                }));
            });
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 14
            }));

            solution.push(currentNode);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 6
            }));

        }

        states.push(new State({solution, graph, visited, stack, root, lineNumber: 16}));
        this.states = states;
        return states;
    }

}
