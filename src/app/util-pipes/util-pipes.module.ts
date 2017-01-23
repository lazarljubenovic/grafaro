import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContainsPipe} from './contains.pipe';
import {OrderedArrayPipe} from './ordered-array.pipe';
import {PercentagePipe} from './percentage.pipe';
import {ObjectPipe} from './object.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ContainsPipe,
        OrderedArrayPipe,
        PercentagePipe,
        ObjectPipe,
    ],
    exports: [
        ContainsPipe,
        OrderedArrayPipe,
        PercentagePipe,
        ObjectPipe,
    ],
})
export class UtilPipesModule {
}
