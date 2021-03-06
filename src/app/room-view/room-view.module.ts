import {NgModule, ModuleWithProviders, OpaqueToken} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomViewComponent} from './room-view.component';
import {GraphModule} from '../graph/graph.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TabsModule} from '../shared/tabs/tabs.module';
import {ChatModule} from '../shared/chat/chat.module';
import {WebSocketService} from '../websocket.service';
import {MatrixModule} from '../matrix/matrix.module';
import {JdenticonModule} from '../jdenticon/jdenticon.module';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from '../toast/toast.module';
import {AlgorithmModule} from '../algorithm/algorithm.module';
import {UserInterfaceModule} from '../user-interface/user-interface.module';
import {SaveDialogComponent} from './save-dialog/save-dialog.component';
import {LoadDialogComponent} from './load-dialog/load-dialog.component';
import {RoomEditService} from './room-edit.service';
import {DebugTableModule} from '../debug-table/debug-table.module';
import {ToolbarService} from './toolbar/toolbar.service';
import {GraphOptionsService} from '../graph-options.service';
import {GraphManager} from '../managers/graph.manager';
import {AlgorithmManager} from '../managers/algorithm.manager';
import {AlgorithmPickerModule} from './algorithm-picker/algorithm-picker.module';
import {ControlsModule} from './controls/controls.module';
import {GraphTemplateService} from './graph-template.service';
import {Auth0Service} from '../core/auth0.service';
import {JoinStorageService} from '../shared/join-service/join-storage.service';
import {MasterStorageService} from '../shared/master-service/master-storage.service';
import {GraphStorageService} from './services/graph-socket/graph-storage.service';
import {LeaveStorageService} from './services/leave-socket/leave-storage.service';

export const AVAILABLE_ALGORITHMS_TOKEN = new OpaqueToken('available_algorithms');

// export function algorithmsFactory(algorithms: any[]): any {
//     console.log(algorithms);
//     return algorithms;
// }

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GraphModule,
        TabsModule,
        ChatModule,
        MatrixModule,
        JdenticonModule,
        ToastModule,
        AlgorithmModule,
        UserInterfaceModule,
        DebugTableModule,
        AlgorithmPickerModule,
        ControlsModule,
    ],
    declarations: [
        RoomViewComponent,
        ToolbarComponent,
        SidebarComponent,
        PopupRenameComponent,
        SaveDialogComponent,
        LoadDialogComponent,
    ],
    providers: [
        WebSocketService,
        MasterStorageService,
        GraphStorageService,
        LeaveStorageService,
        RoomEditService,
        ToolbarService,
        GraphManager,
        GraphOptionsService,
        AlgorithmManager,
        GraphTemplateService,
        Auth0Service,
        JoinStorageService,
    ],
    exports: [
        RoomViewComponent,
    ],
    entryComponents: [
        PopupRenameComponent,
    ]
})
export class RoomViewModule {
    static forRoot(algorithms: any[]): ModuleWithProviders {
        return {
            ngModule: RoomViewModule,
            providers: [
                {
                    provide: 'availableAlgorithms',
                    useValue: algorithms,
                },
            ],
        };
    }
}
