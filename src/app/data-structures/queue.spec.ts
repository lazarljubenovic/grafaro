import {Queue} from "./queue";

describe(`Queue`, () => {

    let queue: Queue<string>;

    beforeEach(() => {
        queue = new Queue<string>();
    });

    it(`should create empty queue`, () => {
        expect(queue.isEmpty).toBeTruthy();
        expect(queue.length).toBe(0);
    });

    it(`should add and remove a single element`, () => {
        queue.enqueue('H');
        expect(queue.isEmpty).toBeFalsy();
        expect(queue.length).toBe(1);
        expect(queue.deque()).toBe('H');
        expect(queue.isEmpty).toBeTruthy();
        expect(queue.length).toBe(0);
    });

    it(`should add and remove a few elements`, () => {
        queue.enqueue('H').enqueue('E').enqueue('A').enqueue('D');
        expect(queue.length).toBe(4);
        expect(queue.deque()).toBe('H');
        expect(queue.deque()).toBe('E');
        expect(queue.length).toBe(2);
        queue.enqueue('P').enqueue('H').enqueue('O').enqueue('N').enqueue('E');
        expect(queue.length).toBe(7);
        expect(queue.deque()).toBe('A');
        expect(queue.deque()).toBe('D');
        expect(queue.deque()).toBe('P');
        expect(queue.length).toBe(4);
        expect(queue.peek()).toBe('H');
        expect(queue.length).toBe(4);
        expect(queue.deque()).toBe('H');
        expect(queue.length).toBe(3);

    });

    it(`should convert to array`, () => {
        queue.enqueue('H').enqueue('E').enqueue('A').enqueue('D');
        expect(queue.toArray()).toEqual(['H', 'E', 'A', 'D']);
    });

});
