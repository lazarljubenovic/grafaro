import {IdGenerator} from './id-generator';

/**
 * Alias for string for better in-code documentation.
 */
export type NodeId = string;

/**
 * Alias for string for better in-code documentation.
 */
export type EdgeId = string;

/**
 * Alias for string for better in-code documentation.
 */
export type NodeLabel = string;

/**
 * Alias for string for better in-code documentation.
 */
export type EdgeLabel = string;

/**
 * A simple position interface in Cartesian coordinates.
 */
export interface GraphNodePosition {
    x: number;
    y: number;
}

/**
 * Represents a graph node.
 */
export interface GraphNode {
    /**
     * Node's unique ID. This is not intended to be displayed to an end-user, but should be used
     * in code to determine if two nodes are the same. Most operations over graph require this ID.
     */
    id: NodeId;

    /**
     * Node's label. This is indented for displaying in user-interface. Does not have to be unique.
     */
    label: NodeLabel;

    /**
     * A number associated with node, which usually represents its weight. Useful because many
     * algorithms are based on node weights.
     */
    weight: number;

    /**
     * Node's position. It only makes sense to use this when you want to represent your graph
     * physically to the end-user. The position represents coordinates in the canvas space.
     */
    position: GraphNodePosition;
}

/**
 *  Represents a graph edge for connecting two nodes.
 */
export interface GraphEdge {
    /**
     * Edge's unique ID. This is not intended to be displayed to an end-user, but should be used
     * in code to determine if two nodes are the same. Most operations over graph require this ID.
     */
    id: EdgeId;

    /**
     * Edge's label. This is indented for displaying in user-interface. Does not have to be unique.
     */
    label: EdgeLabel;

    /**
     * Edges connect two nodes. This property holds the ID of the node it connects from.
     */
        from: NodeId;

    /**
     * Edges connect two nodes. This property holds the ID of the node it connects to. It can be
     * the same as `from`, which means that the edge is a loop around a single node.
     */
    to: NodeId;

    /**
     * A number associated with edge, which usually represents its weight. Useful because many
     * algorithms are based on edge weights.
     */
    weight: number;
}

/**
 * JSON representation of graph. This is used for serializing and deserializing a graph.
 * Useful for storing the graph in a databased or a similar storage.
 */
export interface GraphJson {
    /**
     * An array of all nodes in the graph.
     */
    nodes: GraphNode[];

    /**
     * An array o all edges in the graph.
     */
    edges: GraphEdge[];

    /**
     * The next ID which should be used for the node. When loading graph from persistent storage,
     * it's very important to know what will the next ID be when a node is subsequently added.
     * Hence, this number is stored in order to make further graph manipulation possible.
     */
    nextNodeId: number;

    /**
     * The next ID which should be used for the edge. When loading graph from persistent storage,
     * it's very important to know what will the next ID be when a node is subsequently added.
     * Hence, this number is stored in order to make further graph manipulation possible.
     */
    nextEdgeId: number;
}

/**
 * Represents a graph which is intended to be represented in a graphical way to a user.
 */
export class Graph {

    /**
     * An array of nodes in the graph.
     */
    private _nodes: GraphNode[];

    /**
     * An array of edges in the graph.
     */
    private _edges: GraphEdge[];

    /**
     * Unique ID generator for nodes.
     * @type {IdGenerator}
     * @private
     */
    private _nodeIdGenerator: IdGenerator = new IdGenerator('node');

    /**
     * Unique ID generator for edges.
     * @type {IdGenerator}
     * @private
     */
    private _edgeIdGenerator: IdGenerator = new IdGenerator('edge');

    /**
     * Initialized a graph as an empty graph: no nodes and no edges.
     */
    constructor() {
        this._edges = [];
        this._nodes = [];
    }

    /**
     * Get all graph's nodes.
     * @returns {GraphNode[]}
     */
    public get nodes(): GraphNode[] {
        return this._nodes;
    }

    /**
     * Get all graph's edges.
     * @returns {GraphEdge[]}
     */
    public get edges(): GraphEdge[] {
        return this._edges;
    }

    /**
     * Set the node's unique ID. See `IdGenerator` for more details.
     * @param value
     */
    public setNodeIdGeneratorId(value: number): void {
        this._nodeIdGenerator.id = value;
    }

    /**
     * Set the edge's unique ID. See `IdGenerator` for more details.
     * @param value
     */
    public setEdgeIdGeneratorId(value: number): void {
        this._edgeIdGenerator.id = value;
    }

    /**
     * Serialize an object to JSON. Useful for permanent storage.
     * @returns {GraphJson}
     */
    public writeJson(): GraphJson {
        return {
            nodes: this._nodes,
            edges: this._edges,
            nextNodeId: this._nodeIdGenerator.id,
            nextEdgeId: this._edgeIdGenerator.id
        };
    }

    /**
     * Deserialize an JSON-parsed object and load it into this graph instance.
     * @param json
     * @returns {Graph}
     */
    public readJson(json: GraphJson): this {
        // todo deep copy this
        this._nodes = [];
        this._edges = [];
        json.nodes.forEach(node => this._nodes.push({
            id: node.id,
            label: node.label,
            position: node.position,
            weight: node.weight,
        }));
        json.edges.forEach(edge => this._edges.push({
            id: edge.id,
            label: edge.label,
            from: edge.from,
            to: edge.to,
            weight: edge.weight,
        }));
        this.setNodeIdGeneratorId(json.nextNodeId);
        this.setEdgeIdGeneratorId(json.nextEdgeId);
        return this;
    }

    /**
     * Checks if the graph the given node ID.
     * @param nodeId The ID to check for.
     * @returns {boolean} True if such node exists, false otherwise.
     */
    public hasNodeId(nodeId: NodeId): boolean {
        return this._nodes.find(node => node.id == nodeId) != null;
    }

    /**
     * Grabs the ID of the node with the given labels.
     * You should use this only if you've taken previous care of labels being unique in your graph.
     * Otherwise, results are unexpected and there is no guarantee that the result will always
     * be the same.
     * @param nodeLabel The label to search by.
     * @returns {NodeId | undefined | null} The ID of the node if such a node exists. If the given
     * `nodeLabel` is undefined or null, that same value will be returned.
     */
    public getNodeId(nodeLabel: NodeLabel): NodeId {
        const node = this._nodes.find(node => node.label == nodeLabel);
        if (node == null) {
            return <null | undefined>node;
        }
        return node.id;
    }

    /**
     * Grabs the label of the node with the given ID.
     * @param nodeId {NodeId} The ID to search by.
     * @returns {NodeLabel} The queried label.
     * @throws If there is node with such ID.
     */
    public getNodeLabel(nodeId: NodeId): NodeLabel {
        const node = this._nodes.find(node => node.id == nodeId);
        if (node == null) {
            throw new Error(`Node with id ${nodeId} doesn't exist`);
        }
        return node.label;
    }

    /**
     * Add a new node to the graph.
     * @param label {string} The label of the new node.
     * @param position {GraphNodePosition} The position of the new node.
     * @param weight {number} The weight. One if none is given.
     * @returns {Graph} The mutated instance of the graph. Useful for chaining methods.
     */
    public addNode(label: NodeLabel, position: GraphNodePosition, weight: number = 1): this {
        this._nodes.push({
            id: this._nodeIdGenerator.getNext(),
            label,
            position,
            weight,
        });
        return this;
    }

    /**
     * Remove a node from the graph.
     * @param nodeId {NodeId} The ID of the node to remove.
     * @returns {Graph} The mutated instance of the graph. Useful for chaining methods.
     */
    public removeNode(nodeId: NodeId): this {
        if (!this.hasNodeId(nodeId)) {
            throw new Error(`Node with id ${nodeId} doesn't exist`);
        }

        // Remove node
        this._nodes = this._nodes.filter(node => node.id != nodeId);

        // Remove its associated edges
        this._edges = this._edges
            .filter(edge => !(edge.from === nodeId || edge.to === nodeId));

        return this;
    }

    /**
     * Get the edge based on the ID. Useful for querying for other information based on ID.
     * @param edgeId {EdgeId} The ID to search by.
     * @returns {undefined|GraphEdge} The queried graph edge. Undefined if edge with such ID
     * does not exist.
     */
    public getEdge(edgeId: EdgeId): GraphEdge {
        return this._edges.find(edge => edge.id == edgeId);
    }

    /**
     * Get the edge based on the IDs of the nodes it connects.
     * @param from {NodeId} The ID of the node which is the source of the queried edge.
     * @param to {NodeId} The ID of the node which is the sink of the queried edge.
     * @returns {undefined|GraphEdge} The queried graph edge. Undefined if edge with such ID
     * does not exist.
     */
    public getEdgeByNodes(from: NodeId, to: NodeId): GraphEdge {
        return this._edges.find(edge => edge.from == from && edge.to == to);
    }

    /**
     * Check if the graph contains an edge, based on IDs of the nodes it connects.
     * @param from {NodeId} The ID of the node which is the source of the queried edge.
     * @param to {NodeId} The ID of the node which is the sink of the queried edge.
     * @returns {boolean} True if such edge exists. False otherwise.
     */
    public hasEdge(from: NodeId, to: NodeId): boolean {
        return this._edges.find(edge => edge.from == from && edge.to == to) != null;
    }

    /**
     * Check if there is an edge in the opposite direction of given.
     */
    public hasOppositeEdge(from: NodeId, to: NodeId): boolean {
        return this._edges.find(edge => edge.from == to && edge.to == from) != null;
    }

    /**
     * Check if there is an edge with the given ID.
     */
    public hasEdgeId(edgeId: EdgeId): boolean {
        return this._edges.find(edge => edge.id == edgeId) != null;
    }

    /**
     * Add a new edge to the graph.
     * @param from {NodeId} The ID of the node which will become source of the new edge.
     * @param to {NodeId} The ID of the node which will become sink of the new edge.
     * @param label {EdgeLabel} The label of the new edge.
     * @param weight {number} The weight of the new edge. One if none is given.
     * @returns {Graph} The mutated instace of the graph. Useful for chaining methods.
     * @throws If there already is an edge from the specified nodes.
     */
    public addEdge(from: NodeId, to: NodeId, label: EdgeLabel, weight: number = 1): this {
        if (this.hasEdge(from, to)) {
            throw new Error(`Graph already has edge from ${from} to ${to}`);
        }
        this._edges.push({
            id: this._edgeIdGenerator.getNext(),
            from,
            to,
            label,
            weight,
        });
        return this;
    }

    /**
     * A quick way to add an edge in both directions between two nodes.
     */
    public addUndirectedEdge(from: NodeId, to: NodeId, label: EdgeLabel, weight: number = 1): this {
        return this.addEdge(from, to, label, weight).addEdge(to, from, label, weight);
    }

    /**
     * Remove an edge from the graph.
     * @param from {NodeId} The source of the edge to remove.
     * @param to {NodeId} The sink of the edge to remove.
     * @returns {Graph} The mutated graph instance; useful for chaining.
     */
    public removeEdge(from: NodeId, to: NodeId): this {
        if (!this.hasNodeId(from) || !this.hasNodeId(to)) {
            throw new Error(`Node with such id doesn't exist`);
        }
        const newEdges = this._edges
            .filter(edge => !(edge.from === from && edge.to == to));
        if (this._edges.length == newEdges.length) {
            throw new Error(`Edge from ${from} to ${to} doesn't exist`);
        }
        this._edges = newEdges;
        return this;
    }

    /**
     * Get the label of the edge by its ID.
     * @param edgeId {EdgeId} The ID of the edge used to query for the label.
     * @returns {EdgeLabel} The label of the queried edge.
     */
    public getEdgeLabel(edgeId: EdgeId): EdgeLabel {
        const edge = this._edges.find(edge => edge.id == edgeId);
        if (edge == null) {
            throw new Error(`Edge with id ${edgeId} doesn't exist`);
        }
        return edge.label;
    }

    /**
     * Get the ID of the edge by its label.
     * @param edgeLabel {EdgeLabel} The label of the edge used to query for the ID.
     * @returns {EdgeId} The ID of the queried edge.
     */
    public getEdgeId(edgeLabel: EdgeLabel): EdgeId {
        const edge = this._edges.find(edge => edge.label == edgeLabel);
        if (edge == null) {
            return <null | undefined>edge;
        }
        return edge.id;
    }

    /**
     * Get the weight of the edge by its ID.
     * @param edgeId {EdgeLabel} The label of the edge used to query for its weight.
     * @returns {number} The weight of the queried edge.
     */
    public getEdgeWeight(edgeId: EdgeLabel): number {
        const edge = this._edges.find(edge => edge.id == edgeId);
        if (edge == null) {
            throw new Error(`Edge with id ${edgeId} doesn't exist`);
        }
        return edge.weight;
    }

    /**
     * Change the label of the node.
     * @param nodeId {NodeId} The ID to query the node by.
     * @param newLabel {NodeLabel} The new label.
     * @returns {Graph} The mutated instance of the graph; for chaining.
     * @throws If there is no node with given ID.
     */
    public changeNodeLabel(nodeId: NodeId, newLabel: NodeLabel): this {
        if (!this.hasNodeId(nodeId)) {
            throw new Error(`Node with id ${nodeId} doesn't exist`);
        }
        this._nodes.find(node => node.id == nodeId).label = newLabel;
        return this;
    }

    /**
     * Change the label of the edge.
     * @param edgeId {EdgeId} The ID to query the edge by.
     * @param newLabel {EdgeLabel} The new label.
     * @returns {Graph} The mutated instance fo the graph, for chaining.
     * @throws If there is no edge with given ID.
     */
    public changeEdgeLabel(edgeId: EdgeId, newLabel: EdgeLabel): this {
        if (!this.hasEdgeId(edgeId)) {
            throw new Error(`Edge with id ${edgeId} doesn't exist`);
        }
        this._edges.find(edge => edge.id == edgeId).label = newLabel;
        return this;
    }

    /**
     * Change the node's weight.
     */
    public changeNodeWeight(nodeId: NodeId, newWeight: number): this {
        if (!this.hasNodeId(nodeId)) {
            throw new Error(`Node with id ${nodeId} doesn't exist`);
        }
        this._nodes.find(node => node.id == nodeId).weight = newWeight;
        return this;
    }

    /**
     * Change the edge's weight.
     */
    public changeEdgeWeight(edgeId: EdgeId, newWeight: number): this {
        if (!this.hasEdgeId(edgeId)) {
            throw new Error(`Edge with id ${edgeId} doesn't exist`);
        }
        this._edges.find(edge => edge.id == edgeId).weight = newWeight;
        return this;
    }

    /**
     * Get edges which go from this node to any other node (including loops). See also `getSinks`.
     * @param nodeId {NodeId} The node to query by.
     * @returns {GraphEdge[]} An array of such edges. Note that it can also be an empty array.
     */
    public getSources(nodeId: NodeId): GraphEdge[] {
        return this._edges.filter(edge => edge.from == nodeId);
    }

    /**
     * Get edges which go to this node from any other node (including loops). See also `getSources`.
     * @param nodeId {NodeId} The node to query by.
     * @returns {GraphEdge[]} An array of such edges. Note that it can also be an empty array.
     */
    public getSinks(nodeId: NodeId): GraphEdge[] {
        return this._edges.filter(edge => edge.to == nodeId);
    }

    /**
     * Get the matrix representation of the graph. `null` is used for non-connected nodes.
     * @returns {number[][]} The matrix.
     */
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
