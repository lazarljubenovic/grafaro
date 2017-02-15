import {Document} from 'mongoose';

export interface ChatMessageInfo {
    timeStamp: Date;
    senderName: string;
    message: string;
}

export interface Message<Type> {
    payload: Type;
    type: string;
    roomId: string;
}

export interface JoinMessage {
    roomId: string;
    error: string;
}

export interface MasterMessage {
    isMaster: boolean;
}

export interface RoomEdit {
    name: string;
    description: string;
}

export interface RoomInfo {
    id: string;
    userCount: number;
    name: string;
    description: string;
    master: string;
}

export interface RoomInfoMessage {
    info: RoomInfo[];
}

export interface GraphMessage {
    graph: Graph;
}

export interface AlgorithmMessage {
    info: {
        algorithm: string;
        options: any;
    };
}

export interface StateMessage {
    stateIndex: number
}

export interface IUser extends Document {
    // _id: string;
    // _graphIds: string[];
    displayName: string; // from social networks
    socialId: string;
    graph: DBGraph[];
}

export interface DBGraph {
    graph: Graph;
    lastModified: Date;
    name: string;
}

export interface IProject extends Document {
    id: string;
    creatorId: string;
    algorithm: {
        id: string,
        options: any,
    };
    graph: Graph;
    name: string;
    description: string;
    tags: string[]; // todo
}

export interface GraphNode {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    weight: number;
}

export interface GraphEdge {
    id: string;
    from: string;
    to: string;
    label: string;
    weight: number;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
    nextNodeId?: number;
    nextEdgeId?: number;
}

export const defaultGraph: Graph = {
    nodes: [
        {
            id: 'node-0',
            label: 'A',
            position: {x: 0, y: 0},
            weight: 1,
        },
        {
            id: 'node-1',
            label: 'B',
            position: {x: 100, y: 0},
            weight: 1,
        },
        {
            id: 'node-2',
            label: 'C',
            position: {x: 100, y: 100},
            weight: 1,
        },
        {
            id: 'node-3',
            label: 'D',
            position: {x: -100, y: 100},
            weight: 1,
        },
        {
            id: 'node-4',
            label: 'E',
            position: {x: -100, y: 200},
            weight: 1,
        },
    ],
    edges: [
        {
            id: 'edge-0',
            from: 'node-0',
            to: 'node-1',
            label: '1',
            weight: 1,
        },
        {
            id: 'edge-1',
            from: 'node-0',
            to: 'node-2',
            label: '2',
            weight: 2,
        },
        {
            id: 'edge-2',
            from: 'node-1',
            to: 'node-4',
            label: '4',
            weight: 4,
        },
        {
            id: 'edge-3',
            from: 'node-2',
            to: 'node-3',
            label: '1',
            weight: 1,
        },
        {
            id: 'edge-4',
            from: 'node-4',
            to: 'node-0',
            label: '2',
            weight: 2,
        },
    ],
    nextNodeId: 5,
    nextEdgeId: 5,
};
