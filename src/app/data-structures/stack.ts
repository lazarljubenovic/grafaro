export class Stack<DataType> {

    // Top of the stack is right
    private _array: DataType[] = [];

    public get length(): number {
        return this._array.length;
    }

    public get isEmpty(): boolean {
        return this._array.length == 0;
    }

    public push(newElement: DataType): this {
        this._array.push(newElement);
        return this;
    }

    public pop(): DataType {
        return this._array.pop();
    }

    public peek(): DataType {
        return this._array[this.length - 1];
    }

    public toArray(): DataType[] {
        return this._array;
    }

    public contains(element: DataType): boolean {
        return this._array.indexOf(element) != -1;
    }

}
