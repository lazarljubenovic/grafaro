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
    getLabelIfDefined, KindExporter
} from './algorithm-base';

export class DepthFirstSearchState extends AlgorithmState {

    @TrackedVariable()
    @KindExporter('node') public currentNode: string;

    @ColorExporter(['neighbor'], (ns, n) => ns.map(x => x == n ? 'primary' : 'default'))
    @TrackedVariable()
    @KindExporter('node') public neighbors: string[];

    @ColorExporter([], () => 'primary')
    @TrackedVariable()
    @KindExporter('node') public neighbor: string;

    @TrackedVariable()
    @KindExporter('node') public visited: string[];

    @TrackedVariable()
    @KindExporter('node') public solution: string[];

    @TrackedVariable()
    @KindExporter('node') public stack: string[];

    @TrackedVariable()
    @KindExporter('node') public root: string;

}

interface CreateNewStateObject {
    currentNode?: string,
    neighbors?: string[],
    solution?: string[],
    graph?: Graph,
    visited?: string[],
    stack?: Stack<string>,
    root?: string,
    lineNumber?: number,
    neighbor?: string,
}

export class DepthFirstSearchAlgorithm extends AlgorithmBase {

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

    private cns(o: CreateNewStateObject): DepthFirstSearchState {
        let state = new DepthFirstSearchState(o.graph, o.lineNumber);
        state.currentNode = getLabelIfDefined(o.graph, o.currentNode);
        state.neighbors = getLabelIfDefined(o.graph, o.neighbors);
        state.neighbor = getLabelIfDefined(o.graph, o.neighbor);
        state.solution = getLabelIfDefined(o.graph, o.solution);
        state.visited = getLabelIfDefined(o.graph, o.visited);
        state.stack = getLabelIfDefined(o.graph, o.stack ? o.stack.toArray() : undefined);
        state.root = getLabelIfDefined(o.graph, o.root);
        return state;
    }

    algorithmFunction(graph: Graph, root: string): DepthFirstSearchState[] {
        if (!graph.hasNodeId(root)) {
            throw new Error(`Node with id ${root} (root) doesn't exist on graph!`);
        }

        let states: DepthFirstSearchState[] = [];

        states.push(this.cns({graph, lineNumber: 1}));
        states.push(this.cns({graph, root, lineNumber: 2}));

        let solution: string[] = [];
        states.push(this.cns({solution, graph, root, lineNumber: 3}));

        let stack = new Stack<string>();
        states.push(this.cns({solution, graph, stack, root, lineNumber: 4}));

        stack.push(root);
        states.push(this.cns({solution, graph, stack, root, lineNumber: 5}));

        let visited: string[] = [];
        states.push(this.cns({solution, graph, visited, stack, root, lineNumber: 6}));

        while (!stack.isEmpty) {
            states.push(this.cns({solution, graph, visited, stack, root, lineNumber: 7}));

            let currentNode: string = stack.pop();
            states.push(this.cns({currentNode, solution, graph, visited, stack, root, lineNumber: 8}));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 9}));

            visited.push(currentNode);
            states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 11}));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 12}));

            neighbors = neighbors.filter(neighbor => !stack.contains(neighbor));
            states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 13}));

            neighbors.forEach((neighbor, i) => {
                stack.push(neighbor);
                states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 13, neighbor}));
            });
            states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 14}));

            solution.push(currentNode);
            states.push(this.cns({currentNode, neighbors, solution, graph, visited, stack, root, lineNumber: 6}));

        }

        states.push(this.cns({solution, graph, visited, stack, root, lineNumber: 16}));
        return states;
    }

}
