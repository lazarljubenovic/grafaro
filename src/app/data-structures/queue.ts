export class Queue<DataType> {

    // Tail is left, head is right
    private _array: DataType[] = [];

    public get length(): number {
        return this._array.length;
    }

    public get isEmpty(): boolean {
        return this._array.length == 0;
    }

    public enqueue(newElement: DataType): this {
        this._array.push(newElement);
        return this;
    }

    public deque(): DataType {
        return this._array.shift();
    }

    public peek(): DataType {
        return this._array[0];
    }

    public toArray(): DataType[] {
        return this._array;
    }

}
