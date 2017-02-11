import * as ws from 'ws';
import {Graph, defaultGraph} from './interfaces';

export class Room {
    private _users: Set<ws>;
    private _master: ws;
    private _graph: Graph;
    private _algorithm: any;
    private _name: string;
    private _description: string;

    constructor(roomId: string) {
        this._users = new Set();
        this.graph = defaultGraph;
        this.algorithm = {
            algorithm: 'dfs',
            options: {
                root: 'A'
            }
        };
        this._master = null;
        this._name = `room-${roomId}`;
        this._description = 'New room without description';
    }

    public get users(): Set<ws> {
        return this._users;
    }

    public addUser(user: ws): void {
        this.users.add(user);
        if (this.users.size == 1) {
            this._master = user;
        }
    }

    public removeUser(user: ws): boolean {
        let wasMaster = false;

        this.users.delete(user);

        if (this._master == user && this._users.size > 0) {
            wasMaster = true;
            console.log('The master left. Long live the master!');
            this._master = this.users.values().next().value;
        }

        return wasMaster;
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

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }
}
