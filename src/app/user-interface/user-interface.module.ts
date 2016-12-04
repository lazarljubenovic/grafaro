import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserInterfaceComponent} from './user-interface.component';
import {HeaderComponent} from './header/header.component';
import {GraphModule} from '../graph/graph.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ControlsComponent} from './controls/controls.component';
import {TabsModule} from '../shared/tabs/tabs.module';
import {ChatModule} from '../shared/chat/chat.module';
import {WebSocketService} from '../shared/websocket.service';
import {MatrixModule} from '../matrix/matrix.module';
import {ArrayModule} from '../array/array.module';
import {JdenticonModule} from '../jdenticon/jdenticon.module';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastModule} from '../toast/toast.module';
import {AlgorithmModule} from '../algorithm/algorithm.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GraphModule,
        TabsModule,
        ChatModule,
        MatrixModule,
        ArrayModule,
        JdenticonModule,
        ToastModule,
        AlgorithmModule,
    ],
    declarations: [
        UserInterfaceComponent,
        HeaderComponent,
        ToolbarComponent,
        SidebarComponent,
        ControlsComponent,
        PopupRenameComponent,
    ],
    providers: [
        WebSocketService,
    ],
    exports: [
        UserInterfaceComponent,
    ],
    entryComponents: [
        PopupRenameComponent,
    ]
})
export class UserInterfaceModule {
}
