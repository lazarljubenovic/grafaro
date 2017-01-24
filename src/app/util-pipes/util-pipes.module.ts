import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContainsPipe} from './contains.pipe';
import {OrderedArrayPipe} from './ordered-array.pipe';
import {PercentagePipe} from './percentage.pipe';
import {ObjectPipe} from './object.pipe';
import {OnlyKeysPipe} from './only-keys-pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ContainsPipe,
        OrderedArrayPipe,
        PercentagePipe,
        ObjectPipe,
        OnlyKeysPipe,
    ],
    exports: [
        ContainsPipe,
        OrderedArrayPipe,
        PercentagePipe,
        ObjectPipe,
        OnlyKeysPipe,
    ],
})
export class UtilPipesModule {
}
