/* tslint:disable */
import {NormalizedState} from './algorithm.service';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {Graph} from '../models/graph.model';
import {Stack} from '../data-structures/stack';
import {
    AlgorithmBase,
    TrackedVariable,
    ColorExporter,
    AlgorithmState,
    getLabelIfDefined
} from './algorithm-base';

export class DepthFirstSearchState extends AlgorithmState {

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
    public stack: string[];

    @TrackedVariable()
    public root: string;

}

export class DepthFirstSearchAlgorithm extends AlgorithmBase {

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

    public normalize(state: DepthFirstSearchState): NormalizedState {
        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map(node => {
            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                isStart: state.root == node.label,
                isEnd: false,
                isAccentColor: state.currentNode == node.label,
                isPrimaryColor: state.neighbor == node.label,
                isSecondaryColor: false,
                isDimmedColor: !state.visited ? false : state.visited.indexOf(node.label) != -1,
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;
        const stack: string[] = state.stack;
        const solution: string[] = state.solution;
        const accentColor: string[] = [state.currentNode];
        const primaryColor: string[] = [state.neighbor];
        const secondaryColor: string[] = [];

        return {
            nodes,
            edges,
            stack,
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
                           stack: Stack<string>,
                           root: string,
                           lineNumber: number,
                           currentNeighbor: string = undefined): DepthFirstSearchState {
        let state = new DepthFirstSearchState(graph, lineNumber);
        state.currentNode = getLabelIfDefined(graph, currentNode);
        state.neighbors = getLabelIfDefined(graph, neighbors);
        state.neighbor = getLabelIfDefined(graph, currentNeighbor);
        state.solution = getLabelIfDefined(graph, solution);
        state.visited = getLabelIfDefined(graph, visited);
        state.stack = getLabelIfDefined(graph, stack ? stack.toArray() : undefined);
        state.root = getLabelIfDefined(graph, root);
        return state;
    }

    algorithmFunction(graph: Graph, rootId: string): DepthFirstSearchState[] {
        if (!graph.hasNodeId(rootId)) {
            throw new Error(`Node with id ${rootId} (root) doesn't exist on graph!`);
        }

        let states: DepthFirstSearchState[] = [];

        states.push(this.createNewState(undefined, undefined, undefined, graph, undefined, undefined, undefined, 1));
        states.push(this.createNewState(undefined, undefined, undefined, graph, undefined, undefined, rootId, 2));

        let solution: string[] = [];
        states.push(this.createNewState(undefined, undefined, solution, graph, undefined, undefined, rootId, 3));

        let stack = new Stack<string>();
        states.push(this.createNewState(undefined, undefined, solution, graph, undefined, stack, rootId, 4));

        stack.push(rootId);
        states.push(this.createNewState(undefined, undefined, solution, graph, undefined, stack, rootId, 5));

        let visited: string[] = [];
        states.push(this.createNewState(undefined, undefined, solution, graph, visited, stack, rootId, 6));

        while (!stack.isEmpty) {
            states.push(this.createNewState(undefined, undefined, solution, graph, visited, stack, rootId, 7));

            let currentNode: string = stack.pop();
            states.push(this.createNewState(currentNode, undefined, solution, graph, visited, stack, rootId, 8));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 9));

            visited.push(currentNode);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 11));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 12));

            neighbors = neighbors.filter(neighbor => !stack.contains(neighbor));
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 13));

            neighbors.forEach((neighbor, i) => {
                stack.push(neighbor);
                states.push(this.createNewState(
                    currentNode, neighbors, solution, graph, visited, stack, rootId, 13, neighbor
                ));
            });
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 14));

            solution.push(currentNode);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 6));

        }

        states.push(this.createNewState(undefined, undefined, solution, graph, visited, stack, rootId, 16));
        return states;
    }

}
