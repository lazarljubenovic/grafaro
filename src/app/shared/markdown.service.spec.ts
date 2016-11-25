/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {MarkdownService} from "./markdown.service";

// TODO
xdescribe('Service: Markdown', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MarkdownService]
        });
    });

    it('should ...', inject([MarkdownService], (service: MarkdownService) => {
        expect(service).toBeTruthy();
    }));
});
