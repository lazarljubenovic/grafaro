import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArrayComponent, ArrayQueueDirective, ArrayStackDirective} from './array.component';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
    ],
    declarations: [
        ArrayComponent,
        ArrayQueueDirective,
        ArrayStackDirective,
    ],
    exports: [
        ArrayComponent,
        ArrayQueueDirective,
        ArrayStackDirective,
    ],
})
export class ArrayModule {
}
