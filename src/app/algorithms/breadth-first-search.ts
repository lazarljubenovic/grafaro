import {Queue} from '../data-structures/queue';
import {NormalizedState} from './algorithm.service';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {Graph} from '../models/graph.model';
import {
    AlgorithmBase,
    AlgorithmState,
    TrackedVariable,
    ColorExporter,
    getLabelIfDefined
} from './algorithm-base';

export class BreadthFirstSearchState extends AlgorithmState {

    @TrackedVariable() public currentNode: string;

    @ColorExporter(['neighbor'], (ns, n) => ns.map(x => x == n ? 'primary' : 'default'))
    @TrackedVariable() public neighbors: string[];

    @ColorExporter([], () => 'primary')
    @TrackedVariable() public neighbor: string;

    @TrackedVariable() public visited: string[];

    @TrackedVariable() public solution: string[];

    @TrackedVariable() public queue: string[];

    @TrackedVariable() public root: string;

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

    public normalize(state: BreadthFirstSearchState): NormalizedState {
        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map((node, i) => {
            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                isStart: state.root == node.id,
                isEnd: false,
                isAccentColor: state.currentNode == node.id,
                isPrimaryColor: state.neighbor == node.id,
                isSecondaryColor: false,
                isDimmedColor: !state.visited ? false : state.visited.indexOf(node.label) != -1,
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;
        const queue: string[] = state.queue;
        const solution: string[] = state.solution;
        const accentColor: string[] = [state.currentNode];
        const primaryColor: string[] = [state.neighbor];
        const secondaryColor: string[] = [];

        return {nodes, edges, queue, solution, accentColor, primaryColor, secondaryColor};
    }

    public algorithmFunction(graph: Graph, root: string): BreadthFirstSearchState[] {
        if (!graph.hasNodeId(root)) {
            throw new Error(`Node with id ${root} (root) doesn't exist on graph!`);
        }

        let states: BreadthFirstSearchState[] = [];

        states.push(new BreadthFirstSearchState({graph, lineNumber: 1}));
        states.push(new BreadthFirstSearchState({graph, lineNumber: 2}));

        let solution: string[] = [];
        states.push(new BreadthFirstSearchState({solution, graph, root, lineNumber: 3}));

        let queue = new Queue<string>();
        states.push(new BreadthFirstSearchState({solution, graph, queue, root, lineNumber: 4}));

        queue.enqueue(root);
        states.push(new BreadthFirstSearchState({solution, graph, queue, root, lineNumber: 5}));

        let visited: string[] = [];
        states.push(new BreadthFirstSearchState({
            solution,
            graph,
            visited,
            queue,
            root,
            lineNumber: 6
        }));

        while (!queue.isEmpty) {
            states.push(new BreadthFirstSearchState({
                solution,
                graph,
                visited,
                queue,
                root,
                lineNumber: 7
            }));

            let currentNode: string = queue.deque();
            states.push(new BreadthFirstSearchState({
                currentNode,
                solution,
                graph,
                visited,
                queue,
                root,
                lineNumber: 8
            }));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(new BreadthFirstSearchState({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                queue,
                root,
                lineNumber: 9
            }));

            visited.push(currentNode);
            states.push(new BreadthFirstSearchState({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                queue,
                root,
                lineNumber: 11
            }));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(new BreadthFirstSearchState({
                currentNode, neighbors, solution, graph, visited, queue,
                root,
                lineNumber: 12
            }));

            neighbors = neighbors.filter(neighbor => !queue.contains(neighbor));
            states.push(new BreadthFirstSearchState({
                currentNode, neighbors, solution, graph, visited,
                queue,
                root,
                lineNumber: 13
            }));

            neighbors.forEach((neighbor, i) => {
                queue.enqueue(neighbor);
                states.push(new BreadthFirstSearchState({
                    currentNode, neighbors, solution, graph, visited,
                    queue,
                    root,
                    lineNumber: 13,
                    neighbor
                }));
            });
            states.push(new BreadthFirstSearchState({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                queue,
                root,
                lineNumber: 14
            }));

            solution.push(currentNode);
            states.push(new BreadthFirstSearchState({
                currentNode,
                neighbors,
                solution,
                graph,
                visited,
                queue,
                root,
                lineNumber: 6
            }));

        }

        states.push(new BreadthFirstSearchState({
            solution,
            graph,
            visited,
            queue,
            root,
            lineNumber: 16
        }));
        return states;
    }

}
