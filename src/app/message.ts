export interface Message<Type> {
    payload: Type;
    type: string;
    roomId: string;
}
