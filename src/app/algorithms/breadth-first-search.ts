/* tslint:disable */
import {Queue} from '../data-structures/queue';
import {NormalizedState} from './algorithm.service';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {Graph, GraphJson} from '../models/graph.model';
import {AlgorithmBase} from './algorithm-base';

export interface BreadthFirstSearchState {
    graphJson: GraphJson,
    currentNode: string;
    neighbors: string[];
    visited: string[];
    solution: string[];
    queue: string[];
    root: string;
    neighbor?: string;
    lineNumber: number;
}

export class BreadthFirstSearchAlgorithm extends AlgorithmBase {

    trackedVariables: string[] = [
        'root', 'solution', 'queue', 'visited', 'neighbors'
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
    visited.push(currentNode);
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
                isDimmedColor: state.visited.indexOf(node.id) != -1,
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

    private createNewState(currentNode, neighbors, solution, graph: Graph, visited, queue, root, lineNumber: number,
                                    currentNeighbor?): BreadthFirstSearchState {
    return {
        graphJson: graph.writeJson(),
        currentNode: currentNode ? graph.getNodeLabel(currentNode) : null,
        neighbors: neighbors ? neighbors.map(neighbor => graph.getNodeLabel(neighbor)) : [],
        neighbor: currentNeighbor ? graph.getNodeLabel(currentNeighbor) : null,
        solution: [...solution].map(node => graph.getNodeLabel(node)),
        visited: [...visited].map(node => graph.getNodeLabel(node)),
        queue: [...queue.toArray()].map(node => graph.getNodeLabel(node)),
        root: graph.getNodeLabel(root),
        lineNumber: lineNumber,
    };
}

    algorithmFunction(graph: Graph, rootId: string): BreadthFirstSearchState[] {
        if (!graph.hasNodeId(rootId)) {
            throw new Error(`Node with id ${rootId} (root) doesn't exist on graph!`);
        }

        let states: BreadthFirstSearchState[] = [];

        states.push(this.createNewState(null, null, [], graph, [], new Queue<string>(), rootId, 1));
        states.push(this.createNewState(null, null, [], graph, [], new Queue<string>(), rootId, 2));

        let solution: string[] = [];
        states.push(this.createNewState('', [], [], graph, [], new Queue<string>(), rootId, 3));

        let queue = new Queue<string>();
        states.push(this.createNewState('', [], solution, graph, [], queue, rootId, 4));

        queue.enqueue(rootId);
        states.push(this.createNewState('', [], solution, graph, [], queue, rootId, 6));

        let visited: string[] = [rootId];
        states.push(this.createNewState('', [], solution, graph, visited, queue, rootId, 7));

        while (!queue.isEmpty) {
            states.push(this.createNewState('', [], solution, graph, visited, queue, rootId, 8));

            let currentNode: string = queue.deque();
            states.push(this.createNewState(currentNode, [], solution, graph, visited, queue, rootId, 9));

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

        states.push(this.createNewState('', [], solution, graph, visited, queue, rootId, 17));
        return states;
    }

}

