/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {ChatMessageComponent} from './chat-message.component';
import {EmojiService} from "../../emoji.service";
import {MarkdownService} from "../../markdown.service";

describe('Component: ChatMessage', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [EmojiService, MarkdownService]
		})
	});
	it('should create an instance', () => {
		let component = new ChatMessageComponent();
		expect(component).toBeTruthy();
	});
});
