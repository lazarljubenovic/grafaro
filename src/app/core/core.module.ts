import {NgModule} from '@angular/core';
import {WebSocketService} from './websocket.service';
import {Auth0Service} from './auth0.service';

@NgModule({
    providers: [
        WebSocketService,
        Auth0Service,
    ],
})
export class CoreModule {
}
