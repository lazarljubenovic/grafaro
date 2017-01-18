/* tslint:disable */
import {NormalizedState} from './algorithm.service';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {Graph, GraphJson} from '../models/graph.model';
import {Stack} from '../data-structures/stack';
import {AlgorithmBase} from './algorithm-base';


export interface DepthFirstSearchState {
    graphJson: GraphJson,
    currentNode: string;
    currentNodeNeighbors: string[];
    visitedNodes: string[];
    currentSolution: string[];
    currentStack: string[];
    rootNode: string;
    currentNeighbor?: string;
    lineNumber: number;
}

export class DepthFirstSearchAlgorithm extends AlgorithmBase {

    public code: string = `function DepthFirstSearch(graph, ^[root|rootNode]^) {
  let ^[solution|currentSolution]^ = [];
  let ^[stack|currentStack]^ = new Stack();
  stack.push(root);
  let ^[visited|visitedNodes]^ = new Set();
  visited.add(root);
  while (!stack.isEmpty()) {
    let currentNode = stack.pop();
    let neighbors = graph.neighbors(currentNode);
    visited.push(currentNode);
    ^[neighbors|currentNodeNeighbors]^
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
                isStart: state.rootNode == node.label,
                isEnd: false,
                isAccentColor: state.currentNode == node.label,
                isPrimaryColor: state.currentNeighbor == node.label,
                isSecondaryColor: false,
                isDimmedColor: state.visitedNodes.indexOf(node.label) != -1,
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;
        const stack: string[] = state.currentStack;
        const solution: string[] = state.currentSolution;
        const accentColor: string[] = [state.currentNode];
        const primaryColor: string[] = [state.currentNeighbor];
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

    private createNewState(currentNode, neighbors, solution, graph: Graph, visited, stack, root, lineNumber: number,
                           currentNeighbor?): DepthFirstSearchState {
        return {
            graphJson: graph.writeJson(),
            currentNode: currentNode ? graph.getNodeLabel(currentNode) : null,
            currentNodeNeighbors: neighbors ? neighbors.map(neighbor => graph.getNodeLabel(neighbor)) : [],
            currentNeighbor: currentNeighbor ? graph.getNodeLabel(currentNeighbor) : null,
            currentSolution: [...solution].map(node => graph.getNodeLabel(node)),
            visitedNodes: [...visited].map(node => graph.getNodeLabel(node)),
            currentStack: [...stack.toArray()].map(node => graph.getNodeLabel(node)),
            rootNode: graph.getNodeLabel(root),
            lineNumber: lineNumber,
        };
    }

    algorithmFunction(graph: Graph, rootId: string): DepthFirstSearchState[] {
        if (!graph.hasNodeId(rootId)) {
            throw new Error(`Node with id ${rootId} (root) doesn't exist on graph!`);
        }

        let states: DepthFirstSearchState[] = [];

        states.push(this.createNewState(null, null, [], graph, [], new Stack<string>(), rootId, 1));
        states.push(this.createNewState(null, null, [], graph, [], new Stack<string>(), rootId, 2));

        let solution: string[] = [];
        states.push(this.createNewState('', [], [], graph, [], new Stack<string>(), rootId, 3));

        let stack = new Stack<string>();
        states.push(this.createNewState('', [], solution, graph, [], stack, rootId, 4));

        stack.push(rootId);
        states.push(this.createNewState('', [], solution, graph, [], stack, rootId, 6));

        let visited: string[] = [rootId];
        states.push(this.createNewState('', [], solution, graph, visited, stack, rootId, 7));

        while (!stack.isEmpty) {
            states.push(this.createNewState('', [], solution, graph, visited, stack, rootId, 8));

            let currentNode: string = stack.pop();
            states.push(this.createNewState(currentNode, [], solution, graph, visited, stack, rootId, 9));

            let neighbors: string[] = graph.getSources(currentNode).map(edge => edge.to);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 10));

            visited.push(currentNode);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 12));

            neighbors = neighbors.filter(neighbor => visited.indexOf(neighbor) == -1);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 13));

            neighbors = neighbors.filter(neighbor => !stack.contains(neighbor));
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 14));

            neighbors.forEach((neighbor, i) => {
                stack.push(neighbor);
                states.push(this.createNewState(
                    currentNode, neighbors, solution, graph, visited, stack, rootId, 14, neighbor
                ));
            });
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 15));

            solution.push(currentNode);
            states.push(this.createNewState(currentNode, neighbors, solution, graph, visited, stack, rootId, 7));

        }

        states.push(this.createNewState('', [], solution, graph, visited, stack, rootId, 17));
        return states;
    }

}
