/* tslint:disable:no-unused-variable */
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {TabsComponent} from "./tabs.component";
import {Renderer} from "@angular/core";
import {TabsModule} from "./tabs.module";

// TODO
xdescribe('Component: Tabs', () => {
    let component: TabsComponent;
    let fixture: ComponentFixture<TabsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TabsModule],
            providers: [Renderer]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TabsComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
