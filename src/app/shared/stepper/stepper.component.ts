import {
    Component, OnInit, ContentChildren, QueryList, Renderer, ElementRef,
    AfterContentInit, ViewChild
} from "@angular/core";
import {StepperStepComponent} from "./stepper-step/stepper-step.component";

@Component({
    selector: 'grf-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, AfterContentInit {

    @ContentChildren(StepperStepComponent)
    public stepperSteps: QueryList<StepperStepComponent>;

    @ViewChild('stepOutlet')
    public controls: ElementRef;

    public currentStepNumber: number = 0;

    public goToPrev(): number {
        if (this.currentStepNumber == 0) {
            return this.currentStepNumber;
        } else {
            this.currentStepNumber--;
            this.updateVisible();
            return this.currentStepNumber;
        }
    }

    public goToNext(): number {
        if (this.currentStepNumber == this.stepperSteps.length - 1) {
            return this.currentStepNumber;
        } else {
            this.currentStepNumber++;
            this.updateVisible();
            return this.currentStepNumber;
        }
    }

    private updateVisible(): void {
        this.renderer.detachView(this.stepperSteps.map(el => el.elementRef.nativeElement));
        this.renderer.attachViewAfter(this.controls.nativeElement, [this.stepperSteps.map(el => el.elementRef.nativeElement)[this.currentStepNumber]]);
    }

    constructor(private renderer: Renderer) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.updateVisible();
    }

}
