import {GrfColor} from '../graph/graph.module';
import {Graph} from '../models/graph.model';
import {Stack} from '../data-structures/stack';
import {AlgorithmState, AlgorithmBase} from './algorithm-base';
import {TrackedVar, Color, Algorithm} from './decorators';
import {getLabelIfDefined} from './utils';


@Color({
    nodes: [
        (state: State, nodeLabel: string) =>
            state.currentNode == nodeLabel ? GrfColor.ACCENT : null,
        (state: State, nodeLabel: string) =>
            state.neighbor == nodeLabel ? GrfColor.PRIMARY : null,
        (state: State, nodeLabel: string) =>
            state.neighbors && state.neighbors.indexOf(nodeLabel) != -1 ? GrfColor.SECONDARY : null,
        (state: State, nodeLabel: string) =>
            state.visited && state.visited.indexOf(nodeLabel) != -1 ? GrfColor.DIMMED : null,
    ],
    edges: [],
})
class State extends AlgorithmState {

    @TrackedVar('node') public currentNode: string;

    @TrackedVar('node') public neighbors: string[];

    @TrackedVar('node') public neighbor: string;

    @TrackedVar('node') public visited: string[];

    @TrackedVar('node') public solution: string[];

    @TrackedVar('node') public stack: string[];

    @TrackedVar('node') public root: string;

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

@Algorithm({name: 'Depth First Search', abbr: 'dfs'})
export class DepthFirstSearchAlgorithm extends AlgorithmBase {

    public states: State[];

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

    evaluateStatesFor(graph: Graph, root: string): State[] {
        if (!graph.hasNodeId(root)) {
            // throw new Error(`Node with id ${root} (root) doesn't exist on graph!`);
            return [];
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
                currentNode, solution, graph, visited, stack, root, lineNumber: 8
            }));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 9
            }));

            visited.push(currentNode);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 11
            }));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 12
            }));

            neighbors = neighbors.filter(neighbor => !stack.contains(neighbor));
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 13
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
