import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomBrowserComponent} from './room-browser.component';
import {RouterModule} from '@angular/router';
import {UserInterfaceModule} from '../user-interface/user-interface.module';
import {ProjectCardComponent} from './room-card/room-card.component';
import {JdenticonModule} from '../jdenticon/jdenticon.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UtilPipesModule} from '../util-pipes/util-pipes.module';
import {JoinSocketService} from './join.service';
import {RoomInfoSocketService} from './room-info.service';
import {WebSocketService} from '../websocket.service';
import {MasterSocketService} from '../project-view/master-socket.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UserInterfaceModule,
        JdenticonModule,
        FormsModule,
        ReactiveFormsModule,
        UtilPipesModule,
    ],
    declarations: [
        RoomBrowserComponent,
        ProjectCardComponent,
    ],
    providers: [
        JoinSocketService,
        RoomInfoSocketService,
        WebSocketService,
        MasterSocketService,
    ],
})
export class RoomBrowserModule {
}
