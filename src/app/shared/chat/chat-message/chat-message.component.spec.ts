/* tslint:disable:no-unused-variable */

import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {ChatMessageComponent} from './chat-message.component';
import {EmojiService} from "../../emoji.service";
import {MarkdownService} from "../../markdown.service";

describe('Component: ChatMessage', () => {
	let component: ChatMessageComponent;
	let fixture: ComponentFixture<ChatMessageComponent>;

    beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ChatMessageComponent],
			providers: [EmojiService, MarkdownService]
		})
			.compileComponents();
	});

	beforeEach(() => {
        fixture = TestBed.createComponent(ChatMessageComponent);
        component = fixture.componentInstance;
    });

	it('should create an instance', () => {
		expect(component).toBeTruthy();
	});
});
