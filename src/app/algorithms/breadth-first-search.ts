/* tslint:disable */

import {Graph} from "graphlib";
import {Queue} from "../data-structures/queue";

export interface BreadthFirstSearchState {
    nodeIds: string[];
    nodes: string[];
    edges: {
        from: string;
        to: string;
        label: string;
        id: string;
    }[];
    currentNode: string;
    currentNodeNeighbors: string[];
    visitedNodes: string[];
    currentSolution: string[];
    currentQueue: string[];
    rootNode: string;
    currentNeighbor?: string;
    lineNumber: number;
}

function createNewState(currentNode, neighbors, solution, graph, visited, queue, root, lineNumber: number,
                        currentNeighbor?): BreadthFirstSearchState {
    return {
        currentNode: currentNode ? graph.node(currentNode) : null,
        currentNodeNeighbors: neighbors ? neighbors.map(neighbor => graph.node(neighbor)) : [],
        currentNeighbor: graph.node(currentNeighbor),
        currentSolution: [...solution].map(node => graph.node(node)),
        edges: graph.edges().map(edge => ({
            from: edge.v,
            to: edge.w,
            label: graph.edge({v: edge.v, w: edge.w}),
            id: JSON.stringify({v: edge.v, w: edge.w}),
        })),
        nodes: graph.nodes().map(node => graph.node(node)),
        nodeIds: graph.nodes(),
        visitedNodes: [...visited].map(node => graph.node(node)),
        currentQueue: [currentNode, ...queue.toArray()].map(node => graph.node(node)),
        rootNode: graph.node(root),
        lineNumber: lineNumber,
    };
}

export function breadthFirstSearch(graph: Graph, root: string): BreadthFirstSearchState[] {
    let states: BreadthFirstSearchState[] = [];

    states.push(createNewState(null, null, [], graph, [], new Queue<string>(), root, 1));
    states.push(createNewState(null, null, [], graph, [], new Queue<string>(), root, 2));

    let solution: string[] = [];
    states.push(createNewState('', [], [], graph, [], new Queue<string>(), root, 3));

    let queue = new Queue<string>();
    states.push(createNewState('', [], solution, graph, [], queue, root, 4));

    queue.enqueue(root);
    states.push(createNewState('', [], solution, graph, [], queue, root, 6));

    let visited: string[] = [root];
    states.push(createNewState('', [], solution, graph, visited, queue, root, 7));

    while (!queue.isEmpty) {
        states.push(createNewState('', [], solution, graph, visited, queue, root, 8));

        let currentNode: string = queue.deque();
        states.push(createNewState(currentNode, [], solution, graph, visited, queue, root, 9));

        let neighbors: string[] = graph.neighbors(currentNode);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root, 10));

        visited.push(currentNode);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root, 12));

        neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root, 13));

        neighbors = neighbors.filter(neighbor => !queue.contains(neighbor));
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root, 14));

        neighbors.forEach((neighbor, i) => {
            queue.enqueue(neighbor);
            states.push(createNewState(
                currentNode, neighbors, solution, graph, visited, queue, root, 14, neighbor
            ));
        });
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root, 15));

        solution.push(currentNode);
        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root, 7));

    }

    states.push(createNewState('', [], solution, graph, visited, queue, root, 17));
    return states;
}
