import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ContainsPipe} from "./contains.pipe";
import {OrderedArrayPipe} from "./ordered-array.pipe";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ContainsPipe,
        OrderedArrayPipe,
    ],
    exports: [
        ContainsPipe,
        OrderedArrayPipe,
    ],
})
export class UtilPipesModule {
}
