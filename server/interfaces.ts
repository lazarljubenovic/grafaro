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
}

export interface IUser extends Document {
    id: string;
    googleId: string;
    twitterId: string;
    projectIds: string[];
    username: string; // from social networks
    displayName: string;
}

export interface IProject extends Document {
    id: string;
    creatorId: string;
    algorithmId: string;
    graph: Graph;
}

interface GraphNode {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
}

interface GraphEdge {
    from: string;
    to: string;
    label: string;
    directed: boolean;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}
