import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatrixComponent} from './matrix.component';
import {MatrixWithLabelsPipe} from './matrix-with-labels.pipe';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
