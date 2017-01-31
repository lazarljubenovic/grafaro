import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlgorithmComponent} from './algorithm.component';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import {LineNumberStylePipe} from './line-number-style.pipe';
import {DebugTableModule} from '../debug-table/debug-table.module';

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
        DebugTableModule,
    ],
    declarations: [
        AlgorithmComponent,
        LineNumberStylePipe,
    ],
    exports: [
        AlgorithmComponent,
    ],
    entryComponents: [
    ],
})
export class AlgorithmModule {
}
