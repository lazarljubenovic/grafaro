/* tslint:disable:no-unused-variable */
import {ChatComponent} from "./chat.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ChatModule} from "./chat.module";

// TODO
xdescribe('Component: Chat', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ChatModule],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
