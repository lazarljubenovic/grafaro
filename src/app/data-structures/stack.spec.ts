import {Stack} from './stack';

describe(`Stack`, () => {

    let stack: Stack<string>;

    beforeEach(() => {
        stack = new Stack<string>();
    });

    it(`should create empty stack`, () => {
        expect(stack.isEmpty).toBeTruthy();
        expect(stack.length).toBe(0);
    });

    it(`should add and remove a single element`, () => {
        stack.push('H');
        expect(stack.isEmpty).toBeFalsy();
        expect(stack.length).toBe(1);
        expect(stack.pop()).toBe('H');
        expect(stack.isEmpty).toBeTruthy();
        expect(stack.length).toBe(0);
    });

    it(`should add and remove a few elements`, () => {
        stack.push('H').push('E').push('A').push('D');
        expect(stack.length).toBe(4);
        expect(stack.pop()).toBe('D');
        expect(stack.pop()).toBe('A');
        expect(stack.length).toBe(2);
        stack.push('P').push('H').push('O').push('N').push('E');
        expect(stack.length).toBe(7);
        expect(stack.pop()).toBe('E');
        expect(stack.pop()).toBe('N');
        expect(stack.pop()).toBe('O');
        expect(stack.length).toBe(4);
        expect(stack.peek()).toBe('H');
        expect(stack.length).toBe(4);
        expect(stack.pop()).toBe('H');
        expect(stack.length).toBe(3);
    });

    it(`should convert to array`, () => {
        stack.push('H').push('E').push('A').push('D');
        expect(stack.toArray()).toEqual(['H', 'E', 'A', 'D']);
    });

    it(`should check if stack contains an element`, () => {
        stack.push('H').push('E').push('A').push('D');
        expect(stack.contains('H')).toBe(true);
        expect(stack.contains('X')).toBe(false);
    });

});
