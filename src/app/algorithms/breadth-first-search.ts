import {Graph} from "graphlib";
import {Queue} from "../data-structures/queue";

export interface BreadthFirstSearchState {
    nodes: string[],
    edges: {
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

export function breadthFirstSearch(graph: Graph, root: string): BreadthFirstSearchState[] {
    let states: BreadthFirstSearchState[] = [];

    let solution: string[] = [];
    let nodes = graph.nodes().map(node => ({label: node, distance: Infinity, parent: null}));
    let queue = new Queue<string>();
    queue.enqueue(root);
    let visited: string[] = [root];

    while (!queue.isEmpty) {
        const currentNode: string = queue.deque();
        const neighbors: string[] = graph.neighbors(currentNode);

        visited.push(currentNode);

        neighbors
            .filter(neighbor => visited.indexOf(neighbor) == -1)
            .filter(neighbor => !queue.contains(neighbor))
            .forEach(neighbor => {
                queue.enqueue(neighbor);
            });

        solution.push(currentNode);

        states.push({
            currentNode: currentNode,
            currentNodeNeighbors: neighbors,
            currentSolution: [...solution],
            edges: graph.edges().map(edge => ({
                from: edge.v,
                to: edge.w,
                label: graph.edge({v: edge.v, w: edge.w}),
            })),
            nodes: graph.nodes(),
            visitedNodes: [...visited],
            currentQueue: [...queue.toArray()],
        });
    }

    return states;
}
