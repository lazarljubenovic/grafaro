import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlsComponent} from './controls.component';
import {WebSocketService} from '../../websocket.service';
import {AlgorithmStateManager} from '../../algorithms/state-manager';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';
import {StateStorageService} from './services/state-socket/state-storage.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ControlsComponent,
    ],
    providers: [
        WebSocketService,
        AlgorithmStateManager,
        MasterStorageService,
        StateStorageService,
    ],
    exports: [
        ControlsComponent,
    ]
})
export class ControlsModule {
}
