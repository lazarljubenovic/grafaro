import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectViewComponent} from './project-view.component';
import {GraphModule} from '../graph/graph.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ControlsComponent} from './controls/controls.component';
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
import {GraphSocketService} from './graph-socket.service';
import {SaveDialogComponent} from './save-dialog/save-dialog.component';
import {LoadDialogComponent} from './load-dialog/load-dialog.component';
import {RoomEditService} from './room-edit.service';
import {AlgorithmPickerComponent} from './algorithm-picker/algorithm-picker.component';
import {DebugTableModule} from '../debug-table/debug-table.module';
import {ToolbarService} from './toolbar/toolbar.service';
import {GraphOptionsService} from '../graph-options.service';
import {GraphManager} from '../managers/graph.manager';
import {AlgorithmManager} from '../managers/algorithm.manager';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
    ],
    declarations: [
        ProjectViewComponent,
        ToolbarComponent,
        SidebarComponent,
        ControlsComponent,
        PopupRenameComponent,
        SaveDialogComponent,
        LoadDialogComponent,
        AlgorithmPickerComponent,
    ],
    providers: [
        WebSocketService,
        GraphSocketService,
        RoomEditService,
        ToolbarService,
        GraphManager,
        GraphOptionsService,
        AlgorithmManager,
    ],
    exports: [
        ProjectViewComponent,
    ],
    entryComponents: [
        PopupRenameComponent,
    ]
})
export class ProjectViewModel {
}
