import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {StepperComponent} from "./stepper.component";
import { StepperStepComponent } from './stepper-step/stepper-step.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        StepperComponent,
        StepperStepComponent,
    ],
    exports: [
        StepperComponent,
        StepperStepComponent,
    ],
})
export class StepperModule {
}
