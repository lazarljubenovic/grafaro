import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AnnotationComponent} from "./annotation.component";
import {LineComponent} from "./line/line.component";
import {GeometryService} from "./geometry.service";
import {PolylineComponent} from "./polyline/polyline.component";
import {CalloutLineComponent} from "./callout-line/callout-line.component";
import {CalloutLineService} from "./callout-line/callout-line.service";
import {ElementPositionPipe} from "./element-position.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AnnotationComponent,
        LineComponent,
        PolylineComponent,
        CalloutLineComponent,
        ElementPositionPipe,
    ],
    exports: [
        AnnotationComponent,
    ],
    providers: [
        GeometryService,
        CalloutLineService,
    ],
})
export class AnnotationModule {
}
