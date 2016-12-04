/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {EmojiService} from './emoji.service';

// TODO
describe('Service: Emoji', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EmojiService]
        });
    });

    describe(`Transforming UTF8 Emoji`, () => {

        it('should find emoji by name',
            inject([EmojiService], (service: EmojiService) => {
                const plainText: string = `foo :smile: bar`;
                const emojiText: string = `foo 😄 bar`;
                expect(service.transformUtf8(plainText)).toBe(emojiText);
            }));

        it(`should find multiple emojis by name`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText: string = `foo :smile: bar :smile: baz`;
                const emojiText: string = `foo 😄 bar 😄 baz`;
                expect(service.transformUtf8(plainText)).toBe(emojiText);
            }));

        it(`should find emoji when string starts with one`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText: string = `:smile: bar`;
                const emojiText: string = `😄 bar`;
                expect(service.transformUtf8(plainText)).toBe(emojiText);
            }));

        it(`should find emoji when string ends with one`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText: string = `foo :smile:`;
                const emojiText: string = `foo 😄`;
                expect(service.transformUtf8(plainText)).toBe(emojiText);
            }));

        it(`should find emoji when there is no space around`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText: string = `foo:smile:bar`;
                const emojiText: string = `foo😄bar`;
                expect(service.transformUtf8(plainText)).toBe(emojiText);
            }));

        it(`should not remove : if it's not consumed by an emoji`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText: string = `Here's a list: foo, bar, baz.`;
                expect(service.transformUtf8(plainText)).toBe(plainText);
            }));

    });

    describe(`Transform Text-Like repersentation of emojis`, () => {

        it(`should work for simple emoji`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText = `:)`;
                const emojiText = `😊`;
                expect(service.transformTextLike(plainText)).toBe(emojiText);
            }));

        it(`should work for two emojis`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText = `:) :)`;
                const emojiText = `😊 😊`;
                expect(service.transformTextLike(plainText)).toBe(emojiText);
            }));

        it(`should work text and emoji`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText = `some text (parans :) to confuse) :)`;
                const emojiText = `some text (parans 😊 to confuse) 😊`;
                expect(service.transformTextLike(plainText)).toBe(emojiText);
            }));

        it(`should work for the unescaped heart`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText = `<3`;
                const emojiText = `❤`;
                expect(service.transformTextLike(plainText)).toBe(emojiText);
            }));

        it(`should work for the escaped heart`,
            inject([EmojiService], (service: EmojiService) => {
                const plainText = `&lt;3`;
                const emojiText = `❤`;
                expect(service.transformTextLike(plainText)).toBe(emojiText);
            }));

    });

});
