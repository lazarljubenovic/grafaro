/* tslint:disable:no-unused-variable */
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {SidebarComponent} from "./sidebar.component";
import {WebSocketService} from "../../shared/websocket.service";
import {ChatModule} from "../../shared/chat/chat.module";
import {TabsModule} from "../../shared/tabs/tabs.module";

// TODO
xdescribe('Component: Sidebar', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ChatModule, TabsModule],
            declarations: [SidebarComponent],
            providers: [WebSocketService]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        //fixture.detectChanges();
    });


    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
