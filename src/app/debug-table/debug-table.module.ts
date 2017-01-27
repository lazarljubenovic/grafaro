import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DebugTableComponent} from './debug-table.component';
import {NodeComponent} from './debug-value-single/debug-value-single.component';
import {ArrayOfNodesComponent} from './debug-value-array/debug-value-array.component';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import {DebugValueComponent} from './debug-value/debug-value.component';
import {DebugTableService} from './debug-table.service';
import {FilterPipe} from './filter.pipe';

@NgModule({
    imports: [
        CommonModule,
        UtilPipesModule,
    ],
    declarations: [
        DebugTableComponent,
        NodeComponent,
        ArrayOfNodesComponent,
        DebugValueComponent,
        FilterPipe,
    ],
    exports: [
        DebugTableComponent,
    ],
    providers: [
        DebugTableService,
    ],
})
export class DebugTableModule {
}
