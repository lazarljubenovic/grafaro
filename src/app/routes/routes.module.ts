import {NgModule} from '@angular/core';
import {FourOhFourComponent} from '../four-oh-four/four-oh-four.component';
import {ProjectViewComponent} from '../project-view/project-view.component';
import {LoginPageComponent} from '../login-page/login-page.component';
import {RoomBrowserComponent} from '../project-browser/room-browser.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './auth-guard.service';
import {Auth0Service} from '../core/auth0.service';
import {MockAuthGuardService} from './mock-auth-guard.service';

const routes: Routes = [
    {
        path: '',
        component: RoomBrowserComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'room/:id',
        component: ProjectViewComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        component: FourOhFourComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    providers: [
        Auth0Service,
        {
            provide: AuthGuardService,
            // todo change this for production! add factory!
            useClass: MockAuthGuardService,
        }
    ],
    exports: [
        RouterModule,
    ]
})
export class RoutesModule {
}
