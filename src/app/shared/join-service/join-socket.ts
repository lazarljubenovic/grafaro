import {JoinMessageInfo} from './join-socket.service';
import {Subject} from 'rxjs';
export abstract class JoinSocketInterface {
    /**
     * Stream of Join messages.
     */
    public joinSocket$: Subject<JoinMessageInfo>;

    /**
     * Abstract class for Join messages producers.
     */
    constructor() {
        this.joinSocket$ = new Subject();
    }

    /**
     *  Abstract function for creating new room.
     *  Real producers send message to server and expect a return message.
     *  Mock producers should emulate server response here and next a value to joinSocket$.
     *  @abstract
     */
    public abstract newRoom(): void;

    /**
     * Abstract function for joining a room.
     * Real producers send join message to server with given room id.
     * Mock producers should emulate like in newRoom().
     * @param id Id of a room to join.
     * @abstract
     */
    public abstract joinRoom(id: string): void;

    /**
     * Abstract function for setting WebSocketService roomId property so WebSocketService knows
     * to which room message is directed.
     * It should maybe be moved elsewhere.
     * @param id
     * @abstract
     */
    public abstract setRoom(id: string): void;
}
