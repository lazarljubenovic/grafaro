import {Graph} from '../models/graph.model';


function _getLabelIfDefined(graph: Graph, nodeId: string): any {
    try {
        return graph.getNodeLabel(nodeId);
    } catch (e) {
        return nodeId;
    }
}

function _getLabelsIfDefined(graph: Graph, nodeIds: string[]): any {
    try {
        return nodeIds.map(nodeId => graph.getNodeLabel(nodeId));
    } catch (e) {
        return nodeIds;
    }
}

export function getLabelIfDefined(graph: Graph, id: any): any {
    if (Array.isArray(id)) {
        // if (Array.isArray(id[0])) {
        // eg. [['node-0', 42], ['node-1', 48]]
        // return;
        // } else {
        // eg. ['node-0', 'node-1']
        return _getLabelsIfDefined(graph, id);
        // }
    } else {
        return _getLabelIfDefined(graph, id);
    }
}

function transpose<Type>(arr: Type[][]): Type[][] {
    return arr[0].map((_, i) => arr.map(x => x[i]));
}

function attachNames<Type>(names: string[], arr: Type[]): {[names: string]: Type} {
    let o: {[names: string]: Type} = {};
    for (let i = 0; i < arr.length; i++) {
        o[names[i]] = arr[i];
    }
    return o;
}

export function mergeArrays<Type>(names: string[], arrays: Type[][]): Type[] {
    return <any>transpose<Type>(arrays).map((arr) => attachNames<Type>(names, arr));
}
