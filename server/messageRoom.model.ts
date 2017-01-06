import * as ws from 'ws';
import {RoomInfo, Message, RoomInfoMessage} from './interfaces';
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
                type: 'graph'
            }
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
            name: `room-${id}`,
            master: 'Isus' // todo
        }));

        return roomInfo;
    }

    public sendRoomsInfo(user: ws): void {
        let roomInfoMessage: Message<RoomInfoMessage> = {
            payload: {
                info: this.getRooms(),
            },
            type: 'roomInfo'
        };
        user.send(JSON.stringify(roomInfoMessage));
    }

    private constructor() {
        this.rooms = new Map();
    }
}
