import * as ws from 'ws';
import {RoomInfo, Message, RoomInfoMessage} from './interfaces';

export class MessageRoom {
    private static _instance: MessageRoom = null;
    private rooms: Map<string, Set<ws>>;

    public static getInstance(): MessageRoom {
        if (this._instance == null) {
            MessageRoom._instance = new MessageRoom();
        }

        return MessageRoom._instance;
    }

    private getNextRoomId(): string {
        return Date.now().toString(32);
    }

    public createNewRoom(): string {
        const roomId = this.getNextRoomId();
        console.log('Creating new room with id', roomId);
        this.rooms.set(roomId, new Set());
        return roomId;
    }

    public addUserToRoom(roomId: string, user: ws): void {
        console.log('User joined the room');
        this.rooms.get(roomId).add(user);
    }

    public removeUserFromRoom(roomId: string, user: ws): void {
        console.log('User has left the room');
        this.rooms.get(roomId).delete(user);
    }

    public sendMessageToRoom(roomId: string, user: ws, message: any): void {
        this.rooms.get(roomId)
            .forEach(client => client != user && client.send(JSON.stringify(message)));
    }

    public returnMessage(user: ws, message: any): void {
        user.send(JSON.stringify(message));
    }

    public hasRoom(roomId: string): boolean {
        return this.rooms.has(roomId);
    }

    public userHasRoom(user: ws): boolean {
        let inRoom = false;
        this.rooms.forEach(room => {
            if (room.has(user)) {
                inRoom = true;
            }
        });
        return inRoom;
    }

    public getRooms(): RoomInfo[] {
        let roomInfo: RoomInfo[] = [];

        this.rooms.forEach((users: Set<ws>, roomId: string) => roomInfo.push({
            id: roomId,
            userCount: users.size,
            name: `room-${roomId}`,
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
