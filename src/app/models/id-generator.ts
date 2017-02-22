/**
 * Generates a unique ID.
 */
export class IdGenerator {

    /**
     * The current ID.
     */
    private _id: number;

    /**
     * User-given prefix.
     */
    private _prefix: string;

    /**
     * Creates a new ID generator.
     *
     * @param prefix A string to use as a prefix for each generated ID.
     * Dash will be automatically added.
     * @param initValue The starting value. Zero if none is given.
     */
    constructor(prefix: string, initValue: number = 0) {
        this._prefix = prefix;
        this._id = initValue;
    }

    /**
     * The main function of the generator. Grabs the current unique ID.
     * @returns {string}
     */
    public getNext(): string {
        return `${this._prefix}-${this._id++}`;
    }

    /**
     * Sets the ID. If not used carefully, it can lead to non-unique IDs.
     * Next call to `getNext()` will have this ID (and all subsequent calls will be incremented
     * from there).
     * @param value The new ID.
     */
    public set id(value: number) {
        this._id = value;
    }

    /**
     * Gets the current ID. You probably don't need this.
     * @returns {number} The current ID.
     */
    public get id(): number {
        return this._id;
    }

}
