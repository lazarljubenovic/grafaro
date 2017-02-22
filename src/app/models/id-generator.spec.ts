import {IdGenerator} from './id-generator';


describe(`IdGenerator`, () => {

    it(`should count a few numbers`, () => {
        const generator = new IdGenerator(`a`);
        expect(generator.getNext()).toBe(`a-0`);
        expect(generator.getNext()).toBe(`a-1`);
        expect(generator.getNext()).toBe(`a-2`);
    });

    it(`should set different starting number in constructor`, () => {
        const generator = new IdGenerator(`a`, 5);
        expect(generator.getNext()).toBe(`a-5`);
        expect(generator.getNext()).toBe(`a-6`);
        expect(generator.getNext()).toBe(`a-7`);
    });

    it(`should set the counter in the middle`, () => {
        const generator = new IdGenerator(`a`);
        expect(generator.getNext()).toBe(`a-0`);
        expect(generator.getNext()).toBe(`a-1`);
        generator.id = 10;
        expect(generator.getNext()).toBe(`a-10`);
        expect(generator.getNext()).toBe(`a-11`);
    });

    it(`should set the counter in the middle even though it means repeating`, () => {
        const generator = new IdGenerator(`a`);
        expect(generator.getNext()).toBe(`a-0`);
        expect(generator.getNext()).toBe(`a-1`);
        expect(generator.getNext()).toBe(`a-2`);
        generator.id = 1;
        expect(generator.getNext()).toBe(`a-1`);
        expect(generator.getNext()).toBe(`a-2`);
    });

});
