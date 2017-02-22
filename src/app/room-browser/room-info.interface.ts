export interface RoomInfo {
    id: string;
    name: string;
    master: string;
    userCount: number;
    description: string;
}

export interface RoomInfoMessage {
    info: RoomInfo[];
}
