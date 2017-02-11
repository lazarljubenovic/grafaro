import {Queue} from '../data-structures/queue';
import {GrfColor} from '../graph/graph.module';
import {Graph} from '../models/graph.model';
import {AlgorithmBase, AlgorithmState} from './algorithm-base';
import {Kind, TrackedVar, Color} from './decorators';
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

    @TrackedVar() @Kind('node') public currentNode: string;

    @TrackedVar() @Kind('node') public neighbors: string[];

    @TrackedVar() @Kind('node') public neighbor: string;

    @TrackedVar() @Kind('node') public visited: string[];

    @TrackedVar() @Kind('node') public solution: string[];

    @TrackedVar() @Kind('node') public queue: string[];

    @TrackedVar() @Kind('node') public root: string;

    constructor(o: CreateNewStateObject) {
        super(o.graph, o.lineNumber);
        this.currentNode = getLabelIfDefined(o.graph, o.currentNode);
        this.neighbors = getLabelIfDefined(o.graph, o.neighbors);
        this.neighbor = getLabelIfDefined(o.graph, o.neighbor);
        this.solution = getLabelIfDefined(o.graph, o.solution);
        this.visited = getLabelIfDefined(o.graph, o.visited);
        this.queue = getLabelIfDefined(o.graph, o.queue ? o.queue.toArray() : undefined);
        this.root = getLabelIfDefined(o.graph, o.root);
    }

}

interface CreateNewStateObject {
    currentNode?: string;
    neighbors?: string[];
    solution?: string[];
    graph?: Graph;
    visited?: string[];
    queue?: Queue<string>;
    root?: string;
    lineNumber?: number;
    neighbor?: string;
}

export class BreadthFirstSearchAlgorithm extends AlgorithmBase {

    public states: State[];

    public abbr: string = 'bfs';

    public name: string = 'Breadth First Search';

    public trackedVariables: string[] = [
        'root', 'solution', 'queue', 'visited', 'neighbors', 'currentNode', 'neighbor',
    ];

    public code: string = `function BreadthFirstSearch(graph, root) {
  let solution = [];
  let queue = new Queue();
  queue.enqueue(root);
  let visited = new Set();
  while (!queue.isEmpty()) {
    let currentNode = queue.deque();
    let neighbors = graph.neighbors(currentNode);
    visited.add(currentNode);
    neighbors
      .filter(neighbor => !visited.has(neighbor))
      .filter(neighbor => !queue.has(neighbor))
      .forEach(neighbor => queue.enqueue(neighbor));
    solution.push(currentNode);
  }
  return solution;
}`;

    public evaluateStatesFor(graph: Graph, root: string): State[] {
        if (!graph.hasNodeId(root)) {
            throw new Error(`Node with id ${root} (root) doesn't exist on graph!`);
        }

        let states: State[] = [];

        states.push(new State({graph, lineNumber: 1}));
        states.push(new State({graph, lineNumber: 2}));

        let solution: string[] = [];
        states.push(new State({solution, graph, root, lineNumber: 3}));

        let queue = new Queue<string>();
        states.push(new State({solution, graph, queue, root, lineNumber: 4}));

        queue.enqueue(root);
        states.push(new State({solution, graph, queue, root, lineNumber: 5}));

        let visited: string[] = [];
        states.push(new State({solution, graph, visited, queue, root, lineNumber: 6}));

        while (!queue.isEmpty) {
            states.push(new State({solution, graph, visited, queue, root, lineNumber: 7}));

            let currentNode: string = queue.deque();
            states.push(new State({
                currentNode, solution, graph, visited, queue, root, lineNumber: 8
            }));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: 9
            }));

            visited.push(currentNode);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: 11
            }));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: 12
            }));

            neighbors = neighbors.filter(neighbor => !queue.contains(neighbor));
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: 13
            }));

            neighbors.forEach((neighbor, i) => {
                queue.enqueue(neighbor);
                states.push(new State({
                    currentNode,
                    neighbors,
                    solution,
                    graph,
                    visited,
                    queue,
                    root,
                    lineNumber: 13,
                    neighbor
                }));
            });
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: 14
            }));

            solution.push(currentNode);
            states.push(new State({
                currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: 6
            }));

        }

        states.push(new State({solution, graph, visited, queue, root, lineNumber: 16}));
        this.states = states;
        return states;
    }

}
