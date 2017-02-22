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

    it(`should get only the current id (unprefixed)`, () => {
        const generator = new IdGenerator(`a`);
        expect(generator.id).toBe(0);
        expect(generator.getNext()).toBe(`a-0`);
        expect(generator.id).toBe(1);

        const generator2 = new IdGenerator(`b`, 10);
        expect(generator2.id).toBe(10);
    });

});
