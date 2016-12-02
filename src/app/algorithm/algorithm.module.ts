import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AlgorithmComponent} from "./algorithm.component";
import {PopupComponent} from "./popup/popup.component";
import {ArrayComponent} from "./array/array.component";
import {UtilPipesModule} from "../util-pipes/util-pipes.module";
import {PopupPositionPipe} from "./popup-position.pipe";
import {LineNumberStylePipe} from "./line-number-style.pipe";
import {AnnotationModule} from "../annotation/annotation.module";

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
        AnnotationModule,
    ],
    declarations: [
        AlgorithmComponent,
        PopupComponent,
        ArrayComponent,
        PopupPositionPipe,
        LineNumberStylePipe,
    ],
    exports: [
        AlgorithmComponent,
    ],
})
export class AlgorithmModule {
}