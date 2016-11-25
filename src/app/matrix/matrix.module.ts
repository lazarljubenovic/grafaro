import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatrixComponent} from './matrix.component';
import {MatrixWithLabelsPipe} from './matrix-with-labels.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        MatrixComponent,
        MatrixWithLabelsPipe,
    ],
    exports: [
        MatrixComponent,
    ],
})
export class MatrixModule {
}
