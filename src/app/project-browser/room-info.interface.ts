export interface RoomInfo {
    id: string;
    name: string;
    master: string;
    userCount: number;
}

export interface RoomInfoMessage {
    info: RoomInfo[];
}
