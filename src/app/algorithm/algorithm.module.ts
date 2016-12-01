import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AlgorithmComponent} from "./algorithm.component";
import {PopupComponent} from "./popup/popup.component";
import {ArrayComponent} from "./array/array.component";
import {UtilPipesModule} from "../util-pipes/util-pipes.module";

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
    ],
    declarations: [
        AlgorithmComponent,
        PopupComponent,
        ArrayComponent,
    ],
    exports: [
        AlgorithmComponent,
    ],
})
export class AlgorithmModule {
}
