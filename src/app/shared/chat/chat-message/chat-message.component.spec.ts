/* tslint:disable:no-unused-variable */
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {ChatMessageComponent} from './chat-message.component';
import {EmojiService} from '../../emoji.service';
import {MarkdownService} from '../../markdown.service';
import {JdenticonModule} from '../../../jdenticon/jdenticon.module';
import {TabsService} from '../../tabs/tabs.service';

describe('Component: ChatMessage', () => {
    let component: ChatMessageComponent;
    let fixture: ComponentFixture<ChatMessageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChatMessageComponent],
            providers: [EmojiService, MarkdownService, TabsService],
            imports: [JdenticonModule],
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
