import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AnnotationComponent} from "./annotation.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AnnotationComponent,
    ],
    exports: [
        AnnotationComponent,
    ],
})
export class AnnotationModule {
}
