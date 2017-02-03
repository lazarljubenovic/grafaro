import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, RequestOptions, Http} from '@angular/http';
import {AppComponent} from './app.component';
import {StepperModule} from './shared/stepper/stepper.module';
import {ProjectViewModel} from './project-view/project-view.module';
import {MarkdownService} from './shared/markdown.service';
import {EmojiService} from './shared/emoji.service';
import {GraphOptionsService} from './graph-options.service';
import {ProjectBrowserModule} from './project-browser/project-browser.module';
import {RouterModule} from '@angular/router';
import {ProjectViewComponent} from './project-view/project-view.component';
import {ProjectBrowserComponent} from './project-browser/project-browser.component';
import {FourOhFourModule} from './four-oh-four/four-oh-four.module';
import {FourOhFourComponent} from './four-oh-four/four-oh-four.component';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {LoginPageModule} from './login-page/login-page.module';
import {LoginPageComponent} from './login-page/login-page.component';
import {NotifyService} from './algorithm/notify.service';
import {WebSocketService} from './websocket.service';
import {GraphManager} from './managers/graph.manager';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({}), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StepperModule,
        ProjectViewModel,
        ProjectBrowserModule,
        FourOhFourModule,
        LoginPageModule,
        RouterModule.forRoot([
            {
                path: '',
                component: ProjectBrowserComponent,
            },
            {
                path: 'login',
                component: LoginPageComponent,
            },
            {
                path: 'room/:id',
                component: ProjectViewComponent,
            },
            {
                path: '**',
                component: FourOhFourComponent,
            },
        ]),
    ],
    providers: [
        MarkdownService,
        EmojiService,
        GraphOptionsService,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions],
        },
        NotifyService,
        WebSocketService,
        GraphManager,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
