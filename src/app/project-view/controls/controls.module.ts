import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlsComponent} from './controls.component';
import {WebSocketService} from '../../websocket.service';
import {StateSocketService} from './state-socket.service';
import {AlgorithmStateManager} from '../../algorithms/state-manager';
import {MasterSocketService} from '../master-socket.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ControlsComponent,
    ],
    providers: [
        WebSocketService,
        StateSocketService,
        AlgorithmStateManager,
        MasterSocketService,
    ],
    exports: [
        ControlsComponent,
    ]
})
export class ControlsModule {
}
