import {IdGenerator} from './id-generator';

export type NodeId = string;
export type EdgeId = string;
export type NodeLabel = string;
export type EdgeLabel = string;

interface GraphNodePosition {
    x: number;
    y: number;
}

export interface GraphNode {
    id: NodeId;
    label: NodeLabel;
    weight: number;
    position: GraphNodePosition;
}

export interface GraphEdge {
    id: EdgeId;
    label: EdgeLabel;
    from: NodeId;
    to: NodeId;
    weight: number;
}

export class Graph {

    private _nodes: GraphNode[];
    private _edges: GraphEdge[];

    private _nodeIdGenerator: IdGenerator = new IdGenerator('node');
    private _edgeIdGenerator: IdGenerator = new IdGenerator('edge');

    constructor() {
        this._edges = [];
        this._nodes = [];
    }

    public get nodes(): GraphNode[] {
        return this._nodes;
    }

    public get edges(): GraphEdge[] {
        return this._edges;
    }

    public getNodeId(nodeLabel: NodeLabel): NodeId {
        const node = this._nodes.find(node => node.label == nodeLabel);
        if (node == null) {
            throw new Error(`Node with label ${nodeLabel} doesn't exist`);
        }
        return node.id;
    }

    public getNodeLabel(nodeId: NodeId): NodeLabel {
        const node = this._nodes.find(node => node.id == nodeId);
        if (node == null) {
            throw new Error(`Node with id ${nodeId} doesn't exist`);
        }
        return node.label;
    }

    public addNode(label: NodeLabel, position: GraphNodePosition, weight: number = 1): this {
        this._nodes.push({
            id: this._nodeIdGenerator.getNext(),
            label,
            position,
            weight,
        });
        return this;
    }

    public addEdge(from: NodeId, to: NodeId, label: EdgeLabel, weight: number = 1): this {
        this._edges.push({
            id: this._edgeIdGenerator.getNext(),
            from,
            to,
            label,
            weight,
        });
        return this;
    }

    public addUndirectedEdge(from: NodeId, to: NodeId, label: EdgeLabel, weight: number = 1): this {
        return this.addEdge(from, to, label, weight).addEdge(to, from, label, weight);
    }

    public getSources(nodeId: NodeId): GraphEdge[] {
        return this._edges.filter(edge => edge.from == nodeId);
    }

    public getSinks(nodeId: NodeId): GraphEdge[] {
        return this._edges.filter(edge => edge.to == nodeId);
    }

    public getMatrix(): number[][] {
        const matrix: number[][] = Array(this._nodes.length).fill(null)
            .map(row => Array(this._nodes.length).fill(null));

        this._nodes.forEach((node, rowInd) => {
            const sinkNodeIds: {to: string, w: number}[] = this.getSources(node.id)
                .map(edge => ({
                    to: edge.to,
                    w: edge.weight,
                }));
            const sinkIs: number[] = sinkNodeIds
                .map(node => this._nodes.map(node => node.id).indexOf(node.to));
            sinkIs.forEach((colInd, i) => {
                matrix[rowInd][colInd] = sinkNodeIds[i].w;
            });
        });

        return matrix;
    }

}
