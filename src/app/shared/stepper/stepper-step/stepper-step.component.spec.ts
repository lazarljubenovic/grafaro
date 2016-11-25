/* tslint:disable:no-unused-variable */
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {StepperStepComponent} from "./stepper-step.component";

// TODO
xdescribe('Component: StepperStep', () => {
    let component: StepperStepComponent;
    let fixture: ComponentFixture<StepperStepComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StepperStepComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StepperStepComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});
