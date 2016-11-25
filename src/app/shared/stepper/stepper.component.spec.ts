/* tslint:disable:no-unused-variable */
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {StepperComponent} from "./stepper.component";
import {Renderer} from "@angular/core";

// TODO
xdescribe('Component: Stepper', () => {
    let component: StepperComponent;
    let fixture: ComponentFixture<StepperComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StepperComponent],
            providers: [Renderer]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StepperComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
