import {Document} from 'mongoose';

export interface ChatMessageInfo {
    timeStamp: Date;
    senderName: string;
    senderHandle: string;
    senderHash: string;
    message: string;
}

export interface Message<Type> {
    payload: Type;
    type: string;
    roomId: string;
}

export interface JoinMessage {
    roomId: string;
}

export interface RoomInfo {
    id: string;
    userCount: number;
    name: string;
    master: string;
}

export interface RoomInfoMessage {
    info: RoomInfo[];
}

export interface GraphMessage {
    graph: Graph;
    algorithm: any;
}

export interface IUser extends Document {
    id: string;
    googleId: string;
    twitterId: string;
    projectIds: string[];
    username: string; // from social networks
    displayName: string;
    favProjects: string[];
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
}

export interface GraphEdge {
    id: string;
    from: string;
    to: string;
    label: string;
    weight: string;
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
            position: {
                x: 100,
                y: 100
            }
        },
        {
            id: 'node-1',
            label: 'B',
            position: {
                x: 150,
                y: 150
            }
        }
    ],
    edges: [
        {
            id: 'edge-0',
            from: 'node-0',
            to: 'node-1',
            label: '1',
            weight: '1'
        }
    ],
    nextNodeId: 2,
    nextEdgeId: 1,
};
