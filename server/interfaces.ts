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
    stateIndex: number;
}

export interface IUser extends Document {
    // _id: string;
    // _graphIds: string[];
    displayName: string; // from social networks
    socialId: string;
    graphs: DBGraph[];
}

export interface DBGraph {
    graph: Graph;
    lastModified: number;
    name: string;
}

export interface GraphFileInfo {
    name: string; // user's display name
    graph: {
        lastChange: number;
        id: number; // whatever
        name: string;
    }[];
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
            weight: 1,
            position: {
                x: 27.5,
                y: -15.5,
            },
        },
        {
            id: 'node-5',
            label: 'B',
            weight: 1,
            position: {
                x: 165.5,
                y: -161.5,
            },
        },
        {
            id: 'node-6',
            label: 'C',
            weight: 1,
            position: {
                x: -145.5,
                y: 37.5,
            },
        },
        {
            id: 'node-7',
            label: 'D',
            weight: 1,
            position: {
                x: 245.5,
                y: 94.5,
            },
        },
        {
            id: 'node-8',
            label: 'E',
            weight: 1,
            position: {
                x: 30.5,
                y: 119.5,
            },
        },
        {
            id: 'node-9',
            label: 'F',
            weight: 1,
            position: {
                x: -128.5,
                y: -160.5,
            },
        },
    ],
    edges: [
        {
            id: 'edge-5',
            from: 'node-0',
            to: 'node-5',
            label: 'a',
            weight: 1,
        },
        {
            id: 'edge-6',
            from: 'node-0',
            to: 'node-6',
            label: 'b',
            weight: 1,
        },
        {
            id: 'edge-7',
            from: 'node-0',
            to: 'node-7',
            label: 'c',
            weight: 1,
        },
        {
            id: 'edge-8',
            from: 'node-7',
            to: 'node-5',
            label: 'd',
            weight: 1,
        },
        {
            id: 'edge-9',
            from: 'node-6',
            to: 'node-8',
            label: 'e',
            weight: 1,
        },
        {
            id: 'edge-10',
            from: 'node-9',
            to: 'node-5',
            label: 'f',
            weight: 1,
        },
        {
            id: 'edge-11',
            from: 'node-5',
            to: 'node-9',
            label: 'g',
            weight: 1,
        },
        {
            id: 'edge-12',
            from: 'node-8',
            to: 'node-8',
            label: 'h',
            weight: 1,
        },
        {
            id: 'edge-13',
            from: 'node-8',
            to: 'node-0',
            label: 'i',
            weight: 1,
        },
        {
            id: 'edge-14',
            from: 'node-8',
            to: 'node-5',
            label: 'j',
            weight: 1,
        },
    ],
    nextEdgeId: 15,
    nextNodeId: 11,
};
