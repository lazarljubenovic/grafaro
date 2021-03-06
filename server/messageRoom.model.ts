import * as ws from 'ws';
import {
    RoomInfo,
    Message,
    RoomInfoMessage,
    Graph,
    RoomEdit,
    JoinMessage,
    MasterMessage,
    GraphMessage,
    AlgorithmMessage, StateMessage
} from './interfaces';
import {Room} from './room.model';

export class MessageRoom {
    private static _instance: MessageRoom = null;
    private rooms: Map<string, Room>;

    public static getInstance(): MessageRoom {
        if (this._instance == null) {
            MessageRoom._instance = new MessageRoom();
        }

        return MessageRoom._instance;
    }

    private getNextRoomId(): string {
        return Date.now().toString(36);
    }

    public createNewRoom(): string {
        const roomId = this.getNextRoomId();
        console.log('Creating new room with id', roomId);
        this.rooms.set(roomId, new Room(roomId));
        return roomId;
    }

    public deleteRoom(roomId: string): void {
        this.rooms.delete(roomId);
    }

    public addUserToRoom(roomId: string, user: ws): void {
        try {
            this.rooms.get(roomId).addUser(user);
            console.log('User joined the room', roomId);
            this.sendJoinMessage(user, roomId);



            const roomInfo: RoomEdit = this.getRoomEdit(roomId);

            this.sendMessage(user, 'roomEdit', roomInfo, roomId);
        } catch (exception) {
            console.log(`Room ${roomId} not found.`);
            throw new Error();
        }
    }

    public removeUserFromRoom(roomId: string, user: ws): void {
        const room = this.rooms.get(roomId);
        let wasMaster: boolean = room.removeUser(user);
        let isEmpty: boolean = room.users.size == 0;

        if (isEmpty) {
            this.deleteRoom(roomId);
        } else if (wasMaster) {
            let newMaster = room.master;
            this.sendMasterMessage(newMaster, roomId);
        }
    }

    public sendMessageToRoom(roomId: string, user: ws, message: Message<any>): void {
        console.log(`[${(new Date()).toLocaleTimeString()}]: ${message.type}`);
        this.rooms.get(roomId).users
            .forEach(client => client != user && client.send(JSON.stringify(message)));
    }

    public returnMessage(user: ws, message: Message<any>): void {
        console.log(`[${(new Date()).toLocaleTimeString()}]: ${message.type}`);
        user.send(JSON.stringify(message));
    }

    public sendMessage(user: ws, type: string, payload: any, roomId: string): void {
        const message: Message<any> = {
            roomId,
            payload,
            type,
        };

        this.returnMessage(user, message);
    }

    public userHasRoom(user: ws): string {
        let roomId = '';

        this.rooms.forEach((room, id) => {
            if (room.users.has(user)) {
                roomId = id;
            }
        });

        return roomId;
    }

    public getRooms(): RoomInfo[] {
        let roomInfo: RoomInfo[] = [];

        this.rooms.forEach((room: Room, id: string) => roomInfo.push({
            id: id,
            userCount: room.users.size,
            name: room.name,
            description: room.description,
            master: 'Isus' // todo
        }));

        return roomInfo;
    }

    public sendRoomsInfo(user: ws): void {
        let roomInfoMessage: Message<RoomInfoMessage> = {
            payload: {
                info: this.getRooms(),
            },
            type: 'roomInfo',
            roomId: null
        };
        console.log(`[${(new Date()).toLocaleTimeString()}]: ${roomInfoMessage.type}`);
        user.send(JSON.stringify(roomInfoMessage));
    }

    public setRoomGraph(roomId: string, graph: Graph) {
        this.rooms.get(roomId).graph = graph;
    }

    public setRoomAlgorithm(roomId: string, algorithm: any) {
        this.rooms.get(roomId).algorithm = algorithm;
    }

    public getRoomMaster(roomId: string): ws {
        return this.rooms.get(roomId).master;
    }

    public getRoomEdit(roomId: string): RoomEdit {
        let room = this.rooms.get(roomId);
        return {
            name: room.name,
            description: room.description
        };
    }

    public setRoomEdit(roomId: string, roomEdit: RoomEdit): void {
        this.rooms.get(roomId).name = roomEdit.name;
        this.rooms.get(roomId).description = roomEdit.description;
    }

    public sendJoinMessage(ws: ws, roomId: string, error: string = ''): void {
        const joinMessage: JoinMessage = {
            roomId,
            error
        };

        this.sendMessage(ws, 'join', joinMessage, roomId);
    }

    public sendMasterMessage(ws: ws, roomId: string): void {
        const isMaster = this.getRoomMaster(roomId) == ws;
        const masterMessage: MasterMessage = {
            isMaster,
        };

        this.sendMessage(ws, 'master', masterMessage, roomId);
    }

    public setRoomState(stateIndex: number, roomId: string): void {
        this.rooms.get(roomId).stateIndex = stateIndex;
    }

    public sendGraphMessage(ws: ws, roomId: string): void {
        const graph: GraphMessage = {
            graph: this.rooms.get(roomId).graph,
        };

        this.sendMessage(ws, 'graph', graph, roomId);
    }

    public sendRoomAlgorithm(user: ws, roomId: string): void {
        const algorithm = this.rooms.get(roomId).algorithm;
        const algorithmMessage: AlgorithmMessage = {
            info: algorithm
        };

        this.sendMessage(user, 'algorithm', algorithmMessage, roomId);
    }

    public sendRoomState(user: ws, roomId: string): void {
        // const stateMessage: StateMessage = {
        //     stateIndex: this.rooms.get(roomId).stateIndex,
        // };
        const stateIndex: number = this.rooms.get(roomId).stateIndex;

        this.sendMessage(user, 'state', {stateIndex}, roomId);
    }

    private constructor() {
        this.rooms = new Map();
    }
}
