import * as ws from 'ws';
import {Graph, defaultGraph} from './interfaces';

export class Room {
    public users: Set<ws>;
    private _master: ws;
    private _graph: Graph;
    private _algorithm: any;

    constructor(roomId: string) {
        this.users = new Set();
        this.graph = defaultGraph;
        this.algorithm = {
            id: 'bfs',
            options: {
                root: 'node-0'
            }
        };
        this._master = null;
    }

    public addUser(user: ws): void {
        this.users.add(user);
        if (this.users.size == 1) {
            this._master = user;
        }
    }

    public removeUser(user: ws): void {
        this.users.delete(user);
        if (this._master == user) {
            console.log('The master left. Long live the master!');
            this._master = this.users.values().next().value;
        }
    }

    public set graph(value: Graph) {
        this._graph = value;
    }

    public get graph(): Graph {
        return this._graph;
    }

    public set algorithm(value: any) {
        this._algorithm = value;
    }

    public get algorithm(): any {
        return this._algorithm;
    }

    public get master(): ws {
        return this._master;
    }
}
