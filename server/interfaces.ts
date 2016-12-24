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
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export const defaultGraph: Graph = {
    nodes: [
        {
            id: '100',
            label: 'A',
            position: {
                x: 100,
                y: 100
            }
        },
        {
            id: '101',
            label: 'B',
            position: {
                x: 150,
                y: 150
            }
        }
    ],
    edges: [
        {
            from: '100',
            to: '101',
            label: '1',
        }
    ]
};
