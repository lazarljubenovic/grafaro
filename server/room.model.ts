import * as ws from 'ws';
import {Graph, defaultGraph} from './interfaces';

export class Room {
    public users: Set<ws>;
    public graph: Graph;
    public algorithm: any;

    constructor(roomId: string) {
        this.users = new Set();
        this.graph = defaultGraph;
        this.algorithm = {
            id: 'bfs',
            options: {
                root: 'node-0'
            }
        };
    }

    public addUser(user: ws): void {
        this.users.add(user);
    }

    public removeUser(user: ws): void {
        this.users.delete(user);
    }
}
