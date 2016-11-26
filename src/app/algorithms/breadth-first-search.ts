import {Graph} from "graphlib";
import {Queue} from "../data-structures/queue";

export interface BreadthFirstSearchState {
    nodes: string[];
    edges: {
        from: string;
        to: string;
        label: string;
    }[];
    currentNode: string;
    currentNodeNeighbors: string[];
    visitedNodes: string[];
    currentSolution: string[];
    currentQueue: string[];
    rootNode: string;
    currentNeighbor?: string;
}

function createNewState(currentNode, neighbors, solution, graph, visited, queue, root,
                        currentNeighbor?) {
    return {
        currentNode: currentNode,
        currentNodeNeighbors: neighbors,
        currentNeighbor: currentNeighbor,
        currentSolution: [...solution],
        edges: graph.edges().map(edge => ({
            from: edge.v,
            to: edge.w,
            label: graph.edge({v: edge.v, w: edge.w}),
        })),
        nodes: graph.nodes(),
        visitedNodes: [...visited],
        currentQueue: [currentNode, ...queue.toArray()],
        rootNode: root,
    };
}

export function breadthFirstSearch(graph: Graph, root: string): BreadthFirstSearchState[] {
    let states: BreadthFirstSearchState[] = [];

    let solution: string[] = [];
    let queue = new Queue<string>();
    queue.enqueue(root);
    let visited: string[] = [root];

    let i = 100;

    while (!queue.isEmpty && --i) {
        const currentNode: string = queue.deque();
        const neighbors: string[] = graph.neighbors(currentNode);

        visited.push(currentNode);

        neighbors
            .filter(neighbor => visited.indexOf(neighbor) == -1)
            .filter(neighbor => !queue.contains(neighbor))
            .forEach(neighbor => {
                queue.enqueue(neighbor);
                states.push(createNewState(
                    currentNode, neighbors, solution, graph, visited, queue, root, neighbor
                ));
            });

        solution.push(currentNode);

        states.push(createNewState(currentNode, neighbors, solution, graph, visited, queue, root));
    }

    return states;
}
