import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UserInterfaceComponent} from "./user-interface.component";
import {HeaderComponent} from "./header/header.component";
import {GraphModule} from "../graph/graph.module";
import {BreadthFirstSearchComponent} from "../breadth-first-search/breadth-first-search.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ControlsComponent} from "./controls/controls.component";
import {TabsModule} from "../shared/tabs/tabs.module";
import {ChatModule} from "../shared/chat/chat.module";
import {WebSocketService} from "../shared/websocket.service";

@NgModule({
    imports: [
        CommonModule,
        GraphModule,
        TabsModule,
        ChatModule,
    ],
    declarations: [
        UserInterfaceComponent,
        HeaderComponent,
        BreadthFirstSearchComponent,
        ToolbarComponent,
        SidebarComponent,
        ControlsComponent,
    ],
    providers: [
        WebSocketService,
    ],
    exports: [
        UserInterfaceComponent,
    ]
})
export class UserInterfaceModule {
}
