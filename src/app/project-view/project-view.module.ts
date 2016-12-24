import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectViewComponent} from './project-view.component';
import {GraphModule} from '../graph/graph.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ControlsComponent} from './controls/controls.component';
import {TabsModule} from '../shared/tabs/tabs.module';
import {ChatModule} from '../shared/chat/chat.module';
import {WebSocketService} from '../core/websocket.service';
import {MatrixModule} from '../matrix/matrix.module';
import {JdenticonModule} from '../jdenticon/jdenticon.module';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from '../toast/toast.module';
import {AlgorithmModule} from '../algorithm/algorithm.module';
import {UserInterfaceModule} from '../user-interface/user-interface.module';

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
    ],
    declarations: [
        ProjectViewComponent,
        ToolbarComponent,
        SidebarComponent,
        ControlsComponent,
        PopupRenameComponent,
    ],
    providers: [
        WebSocketService,
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