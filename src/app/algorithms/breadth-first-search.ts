/* tslint:disable */
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

    @TrackedVariable()
    public currentNode: string;

    @ColorExporter(['neighbor'], (ns, n) => ns.map(x => x == n ? 'primary' : 'default'))
    @TrackedVariable()
    public neighbors: string[];

    @ColorExporter([], () => 'primary')
    @TrackedVariable()
    public neighbor: string;

    @TrackedVariable()
    public visited: string[];

    @TrackedVariable()
    public solution: string[];

    @TrackedVariable()
    public queue: string[];

    @TrackedVariable()
    public root: string;

}

export class BreadthFirstSearchAlgorithm extends AlgorithmBase {

    public trackedVariables: string[] = [
        'root', 'solution', 'queue', 'visited', 'neighbors', 'currentNode', 'neighbor',
    ];

    public code: string = `function BreadthFirstSearch(graph, root) {
  let solution = [];
  let queue = new Queue();
  queue.enqueue(root);
  let visited = new Set();
  visited.add(root);
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

        return {
            nodes,
            edges,
            queue,
            solution,
            accentColor,
            primaryColor,
            secondaryColor,
        };
    }

    private createNewState(currentNode: string,
                           neighbors: string[],
                           solution: string[],
                           graph: Graph,
                           visited: string[],
                           queue: Queue<string>,
                           root: string,
                           lineNumber: number,
                           currentNeighbor: string = undefined): BreadthFirstSearchState {
        let state = new BreadthFirstSearchState(graph, lineNumber);
        state.currentNode = getLabelIfDefined(graph, currentNode);
        state.neighbors = getLabelIfDefined(graph, neighbors);
        state.neighbor = getLabelIfDefined(graph, currentNeighbor);
        state.solution = getLabelIfDefined(graph, solution);
        state.visited = getLabelIfDefined(graph, visited);
        state.queue = getLabelIfDefined(graph, queue ? queue.toArray() : undefined);
        state.root = getLabelIfDefined(graph, root);
        return state;
    }

    algorithmFunction(graph: Graph, rootId: string): BreadthFirstSearchState[] {
        if (!graph.hasNodeId(rootId)) {
            throw new Error(`Node with id ${rootId} (root) doesn't exist on graph!`);
        }

        let states: BreadthFirstSearchState[] = [];

        states.push(this.createNewState(undefined, undefined, undefined, graph, undefined, undefined, undefined, 1));
        states.push(this.createNewState(undefined, undefined, undefined, graph, undefined, undefined, rootId, 2));

        let solution: string[] = [];
        states.push(this.createNewState(undefined, undefined, solution, graph, undefined, undefined, rootId, 3));

        let queue = new Queue<string>();
        states.push(this.createNewState(undefined, undefined, solution, graph, undefined, queue, rootId, 4));

        queue.enqueue(rootId);
        states.push(this.createNewState(undefined, undefined, solution, graph, undefined, queue, rootId, 5));

        let visited: string[] = [];
        states.push(this.createNewState(undefined, undefined, solution, graph, visited, queue, rootId, 6));

        visited = [rootId];
        states.push(this.createNewState(undefined, undefined, solution, graph, visited, queue, rootId, 7));

        while (!queue.isEmpty) {
            states.push(this.createNewState(undefined, undefined, solution, graph, visited, queue, rootId, 8));

            let currentNode: string = queue.deque();
            states.push(this.createNewState(currentNode, undefined, solution, graph, visited, queue, rootId, 9));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 10));

            visited.push(currentNode);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 12));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 13));

            neighbors = neighbors.filter(neighbor => !queue.contains(neighbor));
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 14));

            neighbors.forEach((neighbor, i) => {
                queue.enqueue(neighbor);
                states.push(this.createNewState(
                    currentNode, neighbors, solution, graph, visited, queue, rootId, 14, neighbor
                ));
            });
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 15));

            solution.push(currentNode);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 7));

        }

        states.push(this.createNewState(undefined, undefined, solution, graph, visited, queue, rootId, 17));
        return states;
    }

}
