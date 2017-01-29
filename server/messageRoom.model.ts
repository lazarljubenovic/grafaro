import * as ws from 'ws';
import {RoomInfo, Message, RoomInfoMessage, Graph, RoomEdit} from './interfaces';
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
        console.log('User joined the room', roomId);
        this.rooms.get(roomId).addUser(user);

        const graph = this.rooms.get(roomId).graph;
        const algorithm = this.rooms.get(roomId).algorithm;
        this.returnMessage(user, {
            type: 'graph',
            payload: {
                graph,
                algorithm,
            },
            roomId
        });
    }

    public removeUserFromRoom(roomId: string, user: ws): void {
        this.rooms.get(roomId).removeUser(user);
    }

    public sendMessageToRoom(roomId: string, user: ws, message: any): void {
        this.rooms.get(roomId).users
            .forEach(client => client != user && client.send(JSON.stringify(message)));
    }

    public returnMessage(user: ws, message: any): void {
        user.send(JSON.stringify(message));
    }

    public hasRoom(roomId: string): boolean {
        return this.rooms.has(roomId);
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
        user.send(JSON.stringify(roomInfoMessage));
    }

    public getRoomUserCount(roomId: string): number {
        return this.rooms.get(roomId).users.size;
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

    private constructor() {
        this.rooms = new Map();
    }
}
