import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    ArrayComponent, ArrayQueueDirective,
    ArrayStackDirective
} from './array.component';

@NgModule({
    imports: [
        CommonModule,
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
