import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContainsPipe} from './contains.pipe';
import {OrderedArrayPipe} from './ordered-array.pipe';
import {PercentagePipe} from './percentage.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ContainsPipe,
        OrderedArrayPipe,
        PercentagePipe,
    ],
    exports: [
        ContainsPipe,
        OrderedArrayPipe,
        PercentagePipe,
    ],
})
export class UtilPipesModule {
}
