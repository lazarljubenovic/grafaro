import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AnnotationComponent} from "./annotation.component";
import {LineComponent} from "./line/line.component";
import {GeometryService} from "./geometry.service";
import {PolylineComponent} from "./polyline/polyline.component";
import {CalloutLineComponent} from "./callout-line/callout-line.component";
import {CalloutLineService} from "./callout-line/callout-line.service";
import {ElementPositionPipe} from "./element-position.pipe";
import {ArrayComponent} from "./array/array.component";
import {UtilPipesModule} from "../util-pipes/util-pipes.module";

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
    ],
    declarations: [
        AnnotationComponent,
        LineComponent,
        PolylineComponent,
        CalloutLineComponent,
        ElementPositionPipe,
        ArrayComponent,
    ],
    exports: [
        AnnotationComponent,
        ArrayComponent,
    ],
    providers: [
        GeometryService,
        CalloutLineService,
    ],
})
export class AnnotationModule {
}
