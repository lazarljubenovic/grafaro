import {AbstractMessageStream} from './message-stream.abstract.model';
import {ReplaySubject} from 'rxjs';
import {Message} from '../message';
import {RoomInfoMessage} from '../project-browser/room-info.interface';
import {GraphMessage} from '../project-view/graph-socket.service';
import {MasterMessage} from '../project-view/master-socket.service';

const dummyRooms: RoomInfoMessage = {
    info: [
        {
            id: '123456',
            description: 'First dummy room',
            master: 'Kristo',
            name: 'Dummy room #1',
            userCount: 0
        },
        {
            id: '7890',
            description: 'Second dummy room',
            master: 'Hesus',
            name: `Hesus' room`,
            userCount: 0
        }
    ]
};
const dummMasterMessage: MasterMessage = {
    isMaster: true,
};
export const dummyGraph: GraphMessage = {
    graph: {
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
                label: 'p',
                weight: 1,
            },
            {
                id: 'edge-1',
                from: 'node-0',
                to: 'node-2',
                label: 'q',
                weight: 2,
            },
            {
                id: 'edge-2',
                from: 'node-1',
                to: 'node-4',
                label: 'r',
                weight: 4,
            },
            {
                id: 'edge-3',
                from: 'node-2',
                to: 'node-3',
                label: 's',
                weight: 1,
            },
            {
                id: 'edge-4',
                from: 'node-4',
                to: 'node-0',
                label: 't',
                weight: 2,
            },
        ],
        nextNodeId: 5,
        nextEdgeId: 5,
    },
    // algorithm: {
    //     id: 'bfs',
    //     options: {
    //         root: 'node-0',
    //     },
    // },
};

export class MockMessageStream extends AbstractMessageStream {
    public createStream(ws: WebSocket) {
        this._message$ = new ReplaySubject<Message<any>>();

        (<ReplaySubject<Message<any>>>this._message$).next({
            roomId: '',
            type: 'roomInfo',
            payload: dummyRooms
        });

        return this._message$;
    }

    public returnJoin() {
        (<ReplaySubject<Message<any>>>this._message$).next({
            roomId: '123456',
            payload: dummMasterMessage,
            type: 'master'
        });
    }

    public createGraph() {
        (<ReplaySubject<Message<any>>>this._message$).next({
            roomId: '123456',
            payload: dummyGraph,
            type: 'graph'
        });
    }

    constructor(ws: WebSocket) {
        super(ws);
    }
}
