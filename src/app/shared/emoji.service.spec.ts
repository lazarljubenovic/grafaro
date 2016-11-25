/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {EmojiService} from "./emoji.service";

// TODO
xdescribe('Service: Emoji', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EmojiService]
        });
    });

    it('should ...', inject([EmojiService], (service: EmojiService) => {
        expect(service).toBeTruthy();
    }));
});
