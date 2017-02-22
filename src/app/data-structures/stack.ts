/**
 * Represents a stack.
 */
export class Stack<DataType> {

    /**
     * An array which keeps track of the current data in the queue.
     * @private
     * Top of the stack is right.
     */
    private _array: DataType[] = [];

    /**
     * Get the current length of the stack.
     * Consider using `isEmpty` instead of checking for equality with zero.
     * @returns {number} The number of currently present elements in the stack.
     */
    public get length(): number {
        return this._array.length;
    }

    /**
     * Check if the stack is currently empty.
     * @returns {boolean} True if the stack is empty; false otherwise.
     */
    public get isEmpty(): boolean {
        return this._array.length == 0;
    }

    /**
     * Add a new element to the stack.
     * @param newElement An element to add.
     * @returns {Stack} The mutated queue. Useful for chaining.
     */
    public push(newElement: DataType): this {
        this._array.push(newElement);
        return this;
    }

    /**
     * Remove an element from the top of the stack and get that element.
     * @returns {DataType} The removed element.
     */
    public pop(): DataType {
        return this._array.pop();
    }

    /**
     * Peek at the stack without messing with its state.
     * @returns {DataType} The element at the top of the stack, about to be removed.
     */
    public peek(): DataType {
        return this._array[this.length - 1];
    }

    /**
     * Get a plain JavaScript array from the current queue.
     * The top of the stack is at the highest index.
     * @returns {DataType[]}
     */
    public toArray(): DataType[] {
        return this._array;
    }

    /**
     * Check if the stack contains a given element.
     * @param element The element to check for.
     * @returns {boolean} True if the given element exists; false otherwise.
     */
    public contains(element: DataType): boolean {
        return this._array.indexOf(element) != -1;
    }

}
