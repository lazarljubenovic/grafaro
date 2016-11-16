import {Graph} from "graphlib";
import * as Collections from 'typescript-collections';

interface State {
    nodes?: string[],
    edges?: {
        from: string,
        to: string,
        label: string,
    }[],
    currentNode: string,
    currentNodeNeighbors: string[],
    visitedNodes: string[],
    currentSolution: string[],
    currentQueue: string[],
}

export function breadthFirstSearch(graph: Graph, root: string): State[] {
    let states: State[] = [];

    let solution: string[] = [];
    let nodes = graph.nodes().map(node => ({label: node, distance: Infinity, parent: null}));
    let queue = new Collections.Queue();
    queue.enqueue(root);
    let visited: string[] = [root];

    while (!queue.isEmpty()) {
        const currentNode: string = <string>queue.dequeue();
        const neighbors: string[] = graph.neighbors(currentNode);

        neighbors
            .filter(neighbor => visited.indexOf(neighbor) == -1)
            .forEach(neighbor => {
                queue.enqueue(neighbor);
                visited.push(neighbor);
            });
        solution.push(currentNode);

        let queueArray: string[] = [];
        queue.forEach(<any>(el => queueArray.push(<string>el)));

        states.push({
            currentNode: currentNode,
            currentNodeNeighbors: neighbors,
            currentSolution: [...solution],
            //edges: graph.edges().map(edge => ({from: edge.v, to: edge.w, label: edge.name})),
            //nodes: graph.nodes(),
            visitedNodes: [...visited],
            currentQueue: queueArray,
        });
    }

    return states;
}
