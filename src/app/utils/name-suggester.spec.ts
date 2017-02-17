import {suggestNextName} from './name-suggester';


describe(`Name Suggester`, () => {

    it(`should suggest a next letter in alphabet`, () => {
        expect(suggestNextName(['a', 'b', 'c', 'd'])).toBe('e');
    });

    it(`should work on unordered arrays`, () => {
        expect(suggestNextName(['c', 'd', 'a', 'b'])).toBe('e');
    });

    it(`should suggest a next letter in alphabet with missing letters`, () => {
        expect(suggestNextName(['a', 'b', 'd', 'e'])).toBe('f');
    });

    it(`should work for numbers`, () => {
        expect(suggestNextName(['1', '2', '3'])).toBe('4');
    });

    it(`should work for numbers with holes`, () => {
        expect(suggestNextName(['1', '4', '6'])).toBe('7');
    });

    it(`should work with only one argument`, () => {
        expect(suggestNextName(['a'])).toBe('b');
        expect(suggestNextName(['1'])).toBe('2');
    });

    it(`should work without arguments`, () => {
        expect(suggestNextName([])).toBe('A');
    });

    it(`should start appending numbers after z / Z`, () => {
        expect(suggestNextName(['x', 'y', 'z'])).toBe('z1');
        expect(suggestNextName(['A', 'B', 'C', 'Z'])).toBe('Z1');
    });

    it(`should work for words`, () => {
        expect(suggestNextName(['foo'])).toBe('fop');
    });

    it(`should work for words with numbers`, () => {
        expect(suggestNextName(['foo1', 'foo2'])).toBe('foo3');
    });

});
