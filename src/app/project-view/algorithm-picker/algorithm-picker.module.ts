import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlgorithmPickerComponent} from './algorithm-picker.component';
import {GraphManager} from '../../managers/graph.manager';
import {AlgorithmManager} from '../../managers/algorithm.manager';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AlgorithmSocketService} from '../algorithm-socket.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        AlgorithmPickerComponent,
    ],
    providers: [
        GraphManager,
        AlgorithmManager,
        AlgorithmSocketService,
    ],
    exports: [
        AlgorithmPickerComponent,
    ]
})
export class AlgorithmPickerModule {
}
