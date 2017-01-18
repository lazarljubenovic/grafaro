/* tslint:disable */
import {Queue} from '../data-structures/queue';
import {NormalizedState} from './algorithm.service';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {Graph, GraphJson} from '../models/graph.model';

export const CODE = `function BreadthFirstSearch(graph, ^[root|rootNode]^) {
  let ^[solution|currentSolution]^ = [];
  let ^[queue|currentQueue]^ = new Queue();
  queue.enqueue(root);
  let ^[visited|visitedNodes]^ = new Set();
  visited.add(root);
  while (!queue.isEmpty()) {
    let currentNode = queue.deque();
    let neighbors = graph.neighbors(currentNode);
    visited.push(currentNode);
    ^[neighbors|currentNodeNeighbors]^
      .filter(neighbor => !visited.has(neighbor))
      .filter(neighbor => !queue.has(neighbor))
      .forEach(neighbor => queue.enqueue(neighbor));
    solution.push(currentNode);
  }
  return solution;
}
`;

export interface BreadthFirstSearchState {
    graphJson: GraphJson,
    currentNode: string;
    currentNodeNeighbors: string[];
    visitedNodes: string[];
    currentSolution: string[];
    currentQueue: string[];
    rootNode: string;
    currentNeighbor?: string;
    lineNumber: number;
}

export function getCodeJson(code: string, state: BreadthFirstSearchState) {
    return code
        .replace(/ /g, '\u00a0')
        .split('\n')
        .map(line => line
            .split(/(\^\[.*?\]\^)/g)
            .map(word => {
                    if (word.startsWith('^[')) {
                        word = word.slice(2, -2);
                        let text;
                        let propName;
                        if (word.indexOf('|') !== -1) {
                            [text, propName] = word.split('|').map(el => el.trim());
                        } else {
                            text = word;
                            propName = word;
                        }
                        return {
                            text,
                            annotation: {
                                value: state[propName],
                                type: (typeof state[propName] == 'object' && state[propName].length != null) ? 'array' : 'single',
                            }
                        }
                    } else {
                        return {
                            text: word,
                        }
                    }
                }
            )
        );
}

export function breadthFirstSearchNormalizer(state: BreadthFirstSearchState): NormalizedState {
    const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map((node, i) => {
        return {
            id: node.id,
            label: node.label,
            position: node.position,
            weight: node.weight,
            isStart: state.rootNode == node.id,
            isEnd: false,
            isAccentColor: state.currentNode == node.id,
            isPrimaryColor: state.currentNeighbor == node.id,
            isSecondaryColor: false,
            isDimmedColor: state.visitedNodes.indexOf(node.id) != -1,
        };
    });
    const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;
    const queue: string[] = state.currentQueue;
    const solution: string[] = state.currentSolution;
    const accentColor: string[] = [state.currentNode];
    const primaryColor: string[] = [state.currentNeighbor];
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

function createNewState(currentNode, neighbors, solution, graph: Graph, visited, queue, root, lineNumber: number,
                        currentNeighbor?): BreadthFirstSearchState {
    return {
        graphJson: graph.writeJson(),
        currentNode: currentNode ? graph.getNodeLabel(currentNode) : null,
        currentNodeNeighbors: neighbors ? neighbors.map(neighbor => graph.getNodeLabel(neighbor)) : [],
        currentNeighbor: currentNeighbor ? graph.getNodeLabel(currentNeighbor) : null,
        currentSolution: [...solution].map(node => graph.getNodeLabel(node)),
        visitedNodes: [...visited].map(node => graph.getNodeLabel(node)),
        currentQueue: [...queue.toArray()].map(node => graph.getNodeLabel(node)),
        rootNode: graph.getNodeLabel(root),
        lineNumber: lineNumber,
    };
}

export function breadthFirstSearch(graph: Graph, rootId: string): BreadthFirstSearchState[] {
    if (!graph.hasNodeId(rootId)) {
        throw new Error(`Node with id ${rootId} (root) doesn't exist on graph!`);
    }

    let states: BreadthFirstSearchState[] = [];

    states.push(createNewState(null, null, [], graph, [], new Queue<string>(), rootId, 1));
    states.push(createNewState(null, null, [], graph, [], new Queue<string>(), rootId, 2));

    let solution: string[] = [];
    states.push(createNewState('', [], [], graph, [], new Queue<string>(), rootId, 3));

    let queue = new Queue<string>();
    states.push(createNewState('', [], solution, graph, [], queue, rootId, 4));

    queue.enqueue(rootId);
    states.push(createNewState('', [], solution, graph, [], queue, rootId, 6));

    let visited: string[] = [rootId];
    states.push(createNewState('', [], solution, graph, visited, queue, rootId, 7));

    while (!queue.isEmpty) {
        states.push(createNewState('', [], solution, graph, visited, queue, rootId, 8));

        let currentNode: string = queue.deque();
        states.push(createNewState(currentNode, [], solution, graph, visited, queue, rootId, 9));

        let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 10));

        visited.push(currentNode);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 12));

        neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 13));

        neighbors = neighbors.filter(neighbor => !queue.contains(neighbor));
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 14));

        neighbors.forEach((neighbor, i) => {
            queue.enqueue(neighbor);
            states.push(createNewState(
                currentNode, neighbors, solution, graph, visited, queue, rootId, 14, neighbor
            ));
        });
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 15));

        solution.push(currentNode);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, rootId, 7));

    }

    states.push(createNewState('', [], solution, graph, visited, queue, rootId, 17));
    return states;
}
