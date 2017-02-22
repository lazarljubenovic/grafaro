/**
 * Represents a queue.
 */
export class Queue<DataType> {

    /**
     * An array which keeps track of the current data in the queue.
     * @private
     * Tail is left, head is right.
     */
    private _array: DataType[] = [];

    /**
     * Get the current length of the queue.
     * Consider using `isEmpty` instead of checking for equality with zero.
     * @returns {number} The number of currently present elements in the queue.
     */
    public get length(): number {
        return this._array.length;
    }

    /**
     * Check if the queue is currently empty.
     * @returns {boolean} True if the queue is empty. False otherwise.
     */
    public get isEmpty(): boolean {
        return this._array.length == 0;
    }

    /**
     * Add a new element to the queue.
     * @param newElement A new element.
     * @returns {Queue} The mutated queue; for chaining.
     */
    public enqueue(newElement: DataType): this {
        this._array.push(newElement);
        return this;
    }

    /**
     * Remove an element from the queue.
     * @returns The removed element.
     */
    public deque(): DataType {
        return this._array.shift();
    }

    /**
     * Peek at the queue without changing its content.
     * @returns The element which is about to be removed.
     */
    public peek(): DataType {
        return this._array[0];
    }

    /**
     * Get a plain JavaScript array from the current queue.
     * Tail is left (index zero), head is right (highest index).
     * @returns {Array}
     */
    public toArray(): DataType[] {
        return this._array;
    }

    /**
     * Check if the queue contains the given element.
     * Do not overuse this method as it breaks the intended encapsulation by the queue data
     * structure.
     * @param element The element to check.
     * @returns {boolean} True if the given element exists. Otherwise false.
     */
    public contains(element: DataType): boolean {
        return this._array.indexOf(element) != -1;
    }

}
