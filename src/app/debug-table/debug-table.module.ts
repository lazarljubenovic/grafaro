import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DebugTableComponent} from './debug-table.component';
import { NodeComponent } from './node/node.component';
import { ArrayOfNodesComponent } from './array-of-nodes/array-of-nodes.component';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import { DebugValueComponent } from './debug-value/debug-value.component';

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
    ],
    exports: [
        DebugTableComponent,
    ],
})
export class DebugTableModule {
}
