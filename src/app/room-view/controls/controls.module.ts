import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlsComponent} from './controls.component';
import {WebSocketService} from '../../websocket.service';
import {StateSocketService} from './state-socket.service';
import {AlgorithmStateManager} from '../../algorithms/state-manager';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';

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
        MasterStorageService,
    ],
    exports: [
        ControlsComponent,
    ]
})
export class ControlsModule {
}
