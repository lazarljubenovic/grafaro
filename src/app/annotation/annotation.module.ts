import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AnnotationComponent} from "./annotation.component";
import {LineComponent} from "./line/line.component";
import {GeometryService} from "./line/geometry.service";
import { PolylineComponent } from './polyline/polyline.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AnnotationComponent,
        LineComponent,
        PolylineComponent,
    ],
    exports: [
        AnnotationComponent,
    ],
    providers: [
        GeometryService,
    ],
})
export class AnnotationModule {
}
