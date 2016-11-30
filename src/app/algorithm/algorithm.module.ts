import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AlgorithmComponent} from "./algorithm.component";
import { PopupComponent } from './popup/popup.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        AlgorithmComponent,
        PopupComponent,
    ],
    exports: [
        AlgorithmComponent,
    ],
})
export class AlgorithmModule {
}
