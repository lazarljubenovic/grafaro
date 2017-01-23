import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlgorithmComponent} from './algorithm.component';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import {LineNumberStylePipe} from './line-number-style.pipe';
import {AnnotationModule} from '../annotation/annotation.module';
import {AnnotationDirective} from './annotation/annotation.directive';
import {AnnotationComponent} from '../annotation/annotation.component';
import {ArrayComponent} from './annotation/array/array.component';
import {SingleItemComponent} from './annotation/single-item/single-item.component';
import {EmptyComponent} from './annotation/empty/empty.component';
import {NullComponent} from './annotation/null/null.component';
import {DebugTableModule} from '../debug-table/debug-table.module';

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
        AnnotationModule,
        DebugTableModule,
    ],
    declarations: [
        AlgorithmComponent,
        LineNumberStylePipe,
        AnnotationDirective,
        ArrayComponent,
        SingleItemComponent,
        EmptyComponent,
        NullComponent,
    ],
    exports: [
        AlgorithmComponent,
    ],
    entryComponents: [
        AnnotationComponent,
        ArrayComponent,
        SingleItemComponent,
        EmptyComponent,
        NullComponent,
    ],
    providers: [],
})
export class AlgorithmModule {
}
